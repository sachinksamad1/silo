import { CreateEntryInput, Entry, EntrySchema, UpdateEntryInput } from 'core';
import { v4 as uuid } from 'uuid';
import { EntryRepositoryLike } from './entry.repo';

type SqlParams = Array<string | number | null>;

interface SQLiteQueryable {
  runAsync(source: string, params?: SqlParams): Promise<unknown>;
  getFirstAsync<T>(source: string, params?: SqlParams): Promise<T | null>;
  getAllAsync<T>(source: string, params?: SqlParams): Promise<T[]>;
}

export interface NativeSQLiteDatabase extends SQLiteQueryable {
  execAsync(source: string): Promise<void>;
  withExclusiveTransactionAsync?(
    task: (txn: SQLiteQueryable) => Promise<void>
  ): Promise<void>;
}

type EntryRow = {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  tags: string;
  mood: number | null;
  attachments: string;
  dirty: number;
  deleted: number;
  lastSyncedAt: number | null;
  version: number;
};

function toEntry(row: EntryRow): Entry {
  return EntrySchema.parse({
    id: row.id,
    content: JSON.parse(row.content),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    tags: JSON.parse(row.tags),
    mood: row.mood ?? undefined,
    attachments: JSON.parse(row.attachments),
    dirty: Boolean(row.dirty),
    deleted: Boolean(row.deleted),
    lastSyncedAt: row.lastSyncedAt ?? undefined,
    version: row.version,
  });
}

function serializeEntry(entry: Entry) {
  return [
    entry.id,
    JSON.stringify(entry.content),
    entry.createdAt,
    entry.updatedAt,
    JSON.stringify(entry.tags),
    entry.mood ?? null,
    JSON.stringify(entry.attachments),
    entry.dirty ? 1 : 0,
    entry.deleted ? 1 : 0,
    entry.lastSyncedAt ?? null,
    entry.version,
  ] satisfies SqlParams;
}

async function insertEntry(db: SQLiteQueryable, entry: Entry) {
  await db.runAsync(
    `INSERT INTO entries (
      id,
      content,
      createdAt,
      updatedAt,
      tags,
      mood,
      attachments,
      dirty,
      deleted,
      lastSyncedAt,
      version
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    serializeEntry(entry)
  );
}

async function updateEntryRecord(db: SQLiteQueryable, entry: Entry) {
  await db.runAsync(
    `UPDATE entries
      SET content = ?,
          createdAt = ?,
          updatedAt = ?,
          tags = ?,
          mood = ?,
          attachments = ?,
          dirty = ?,
          deleted = ?,
          lastSyncedAt = ?,
          version = ?
      WHERE id = ?`,
    [
      JSON.stringify(entry.content),
      entry.createdAt,
      entry.updatedAt,
      JSON.stringify(entry.tags),
      entry.mood ?? null,
      JSON.stringify(entry.attachments),
      entry.dirty ? 1 : 0,
      entry.deleted ? 1 : 0,
      entry.lastSyncedAt ?? null,
      entry.version,
      entry.id,
    ]
  );
}

async function withWriteTransaction(
  db: NativeSQLiteDatabase,
  task: (executor: SQLiteQueryable) => Promise<void>
) {
  if (db.withExclusiveTransactionAsync) {
    await db.withExclusiveTransactionAsync(task);
    return;
  }

  await task(db);
}

export async function migrateNativeStorage(db: NativeSQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY NOT NULL,
      content TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      tags TEXT NOT NULL,
      mood INTEGER,
      attachments TEXT NOT NULL,
      dirty INTEGER NOT NULL DEFAULT 1,
      deleted INTEGER NOT NULL DEFAULT 0,
      lastSyncedAt INTEGER,
      version INTEGER NOT NULL DEFAULT 1
    );

    CREATE INDEX IF NOT EXISTS idx_entries_updated_at ON entries(updatedAt DESC);
    CREATE INDEX IF NOT EXISTS idx_entries_dirty ON entries(dirty);
    CREATE INDEX IF NOT EXISTS idx_entries_deleted ON entries(deleted);
  `);
}

export class NativeEntryRepository implements EntryRepositoryLike {
  constructor(private readonly db: NativeSQLiteDatabase) {}

  async create(input: CreateEntryInput): Promise<Entry> {
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

    await insertEntry(this.db, entry);
    return entry;
  }

  async update(id: string, updates: UpdateEntryInput): Promise<Entry | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;

    const updated: Entry = {
      ...existing,
      ...updates,
      updatedAt: Date.now(),
      dirty: true,
      version: existing.version + 1,
    };

    await updateEntryRecord(this.db, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const entry = await this.getById(id);
    if (!entry) return;

    await updateEntryRecord(this.db, {
      ...entry,
      deleted: true,
      dirty: true,
      updatedAt: Date.now(),
    });
  }

  async getAll(): Promise<Entry[]> {
    const rows = await this.db.getAllAsync<EntryRow>(
      'SELECT * FROM entries WHERE deleted = 0 ORDER BY updatedAt DESC'
    );

    return rows.map(toEntry);
  }

  async getById(id: string): Promise<Entry | undefined> {
    const row = await this.db.getFirstAsync<EntryRow>(
      'SELECT * FROM entries WHERE id = ? LIMIT 1',
      [id]
    );

    return row ? toEntry(row) : undefined;
  }

  async getDirty(): Promise<Entry[]> {
    const rows = await this.db.getAllAsync<EntryRow>(
      'SELECT * FROM entries WHERE dirty = 1 ORDER BY updatedAt DESC'
    );

    return rows.map(toEntry);
  }

  async markSynced(ids: string[]): Promise<void> {
    if (ids.length === 0) return;

    const now = Date.now();

    await withWriteTransaction(this.db, async (executor) => {
      for (const id of ids) {
        await executor.runAsync(
          'UPDATE entries SET dirty = 0, lastSyncedAt = ? WHERE id = ?',
          [now, id]
        );
      }
    });
  }

  async bulkUpsert(entries: Entry[]): Promise<void> {
    if (entries.length === 0) return;

    await withWriteTransaction(this.db, async (executor) => {
      for (const remote of entries) {
        const localRow = await executor.getFirstAsync<EntryRow>(
          'SELECT * FROM entries WHERE id = ? LIMIT 1',
          [remote.id]
        );

        if (!localRow) {
          await insertEntry(executor, {
            ...remote,
            dirty: false,
          });
          continue;
        }

        const local = toEntry(localRow);
        if (remote.updatedAt > local.updatedAt) {
          await updateEntryRecord(executor, {
            ...remote,
            dirty: false,
          });
        }
      }
    });
  }
}
