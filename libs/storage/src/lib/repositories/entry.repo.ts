import { db } from '../db'
import { v4 as uuid } from 'uuid'
import { Entry, CreateEntryInput, UpdateEntryInput } from 'core'
import { EntryEntity } from '../schema'

export class EntryRepository {

  // CREATE — accepts validated input from libs/core CreateEntryInput
  async create(input: CreateEntryInput): Promise<EntryEntity> {
    const now = Date.now()

    const entry: Entry = {
      id: uuid(),
      content: input.content,
      createdAt: now,
      updatedAt: now,
      tags: input.tags ?? [],
      mood: input.mood,
      attachments: input.attachments ?? [],
      dirty: true,
      deleted: false,
      version: 1,
    }

    await db.entries.add(entry)
    return entry
  }

  // UPDATE — accepts validated partial input from libs/core UpdateEntryInput
  async update(id: string, updates: UpdateEntryInput): Promise<EntryEntity | undefined> {
    const existing = await db.entries.get(id)
    if (!existing) return undefined

    const updated: Entry = {
      ...existing,
      ...updates,
      updatedAt: Date.now(),
      dirty: true,
      version: existing.version + 1,
    }

    await db.entries.put(updated)
    return updated
  }

  // SOFT DELETE — sets deleted=true, dirty=true, never hard-deletes
  async delete(id: string): Promise<void> {
    const entry = await db.entries.get(id)
    if (!entry) return

    await db.entries.put({
      ...entry,
      deleted: true,
      dirty: true,
      updatedAt: Date.now(),
    })
  }

  // GET ALL (Timeline) — returns non-deleted entries ordered by updatedAt desc
  async getAll(): Promise<EntryEntity[]> {
    return db.entries
      .orderBy('updatedAt')
      .reverse()
      .filter((entry) => !entry.deleted)
      .toArray();
  }

  // GET BY ID
  async getById(id: string): Promise<EntryEntity | undefined> {
    return db.entries.get(id)
  }

  // GET DIRTY — returns all entries pending sync
  async getDirty(): Promise<EntryEntity[]> {
    return db.entries
      .filter((entry) => !!entry.dirty)
      .toArray();
  }

  // MARK SYNCED — clears dirty flag after successful push
  async markSynced(ids: string[]): Promise<void> {
    const now = Date.now()

    await db.transaction('rw', db.entries, async () => {
      for (const id of ids) {
        const entry = await db.entries.get(id)
        if (!entry) continue

        await db.entries.put({
          ...entry,
          dirty: false,
          lastSyncedAt: now,
        })
      }
    })
  }

  // BULK UPSERT (from server pull) — LWW conflict resolution on updatedAt
  async bulkUpsert(entries: Entry[]): Promise<void> {
    await db.transaction('rw', db.entries, async () => {
      for (const remote of entries) {
        const local = await db.entries.get(remote.id)

        if (!local) {
          await db.entries.add({ ...remote, dirty: false })
          continue
        }

        // LWW: remote wins only if it's strictly newer
        if (remote.updatedAt > local.updatedAt) {
          await db.entries.put({ ...remote, dirty: false })
        }
      }
    })
  }
}