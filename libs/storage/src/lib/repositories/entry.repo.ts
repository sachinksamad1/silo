import { CreateEntryInput, Entry, UpdateEntryInput } from 'core';
import { v4 as uuid } from 'uuid';

async function getWebDb() {
  const { db } = await import('../db');
  return db;
}

export interface EntryRepositoryLike {
  create(input: CreateEntryInput): Promise<Entry>;
  update(id: string, updates: UpdateEntryInput): Promise<Entry | undefined>;
  delete(id: string): Promise<void>;
  getAll(): Promise<Entry[]>;
  getById(id: string): Promise<Entry | undefined>;
  getDirty(): Promise<Entry[]>;
  markSynced(ids: string[]): Promise<void>;
  bulkUpsert(entries: Entry[]): Promise<void>;
}

export class EntryRepository implements EntryRepositoryLike {
  async create(input: CreateEntryInput): Promise<Entry> {
    const db = await getWebDb();
    const now = Date.now();

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
    };

    await db.entries.add(entry);
    return entry;
  }

  async update(id: string, updates: UpdateEntryInput): Promise<Entry | undefined> {
    const db = await getWebDb();
    const existing = await db.entries.get(id);
    if (!existing) return undefined;

    const updated: Entry = {
      ...existing,
      ...updates,
      updatedAt: Date.now(),
      dirty: true,
      version: existing.version + 1,
    };

    await db.entries.put(updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const db = await getWebDb();
    const entry = await db.entries.get(id);
    if (!entry) return;

    await db.entries.put({
      ...entry,
      deleted: true,
      dirty: true,
      updatedAt: Date.now(),
    });
  }

  async getAll(): Promise<Entry[]> {
    const db = await getWebDb();
    return db.entries.orderBy('updatedAt').reverse().filter((entry) => !entry.deleted).toArray();
  }

  async getById(id: string): Promise<Entry | undefined> {
    const db = await getWebDb();
    return db.entries.get(id);
  }

  async getDirty(): Promise<Entry[]> {
    const db = await getWebDb();
    return db.entries.filter((entry) => !!entry.dirty).toArray();
  }

  async markSynced(ids: string[]): Promise<void> {
    const db = await getWebDb();
    const now = Date.now();

    await db.transaction('rw', db.entries, async () => {
      for (const id of ids) {
        const entry = await db.entries.get(id);
        if (!entry) continue;

        await db.entries.put({
          ...entry,
          dirty: false,
          lastSyncedAt: now,
        });
      }
    });
  }

  async bulkUpsert(entries: Entry[]): Promise<void> {
    const db = await getWebDb();

    await db.transaction('rw', db.entries, async () => {
      for (const remote of entries) {
        const local = await db.entries.get(remote.id);

        if (!local) {
          await db.entries.add({ ...remote, dirty: false });
          continue;
        }

        if (remote.updatedAt > local.updatedAt) {
          await db.entries.put({ ...remote, dirty: false });
        }
      }
    });
  }
}
