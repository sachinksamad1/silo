import { pgTable, text, bigint, boolean, jsonb } from 'drizzle-orm/pg-core';

// ── entries ───────────────────────────────────────────────────────────────────
// Mirrors libs/core EntrySchema exactly.
// content is jsonb to support TipTap JSON docs and future encrypted blobs.
export const entries = pgTable('entries', {
  id:           text('id').primaryKey(),
  content:      jsonb('content').notNull(),          // TipTap JSON / encrypted blob (Phase 2)
  createdAt:    bigint('created_at', { mode: 'number' }).notNull(),      // Unix ms
  updatedAt:    bigint('updated_at', { mode: 'number' }).notNull(),      // Unix ms — used for LWW
  tags:         text('tags').array().notNull().default([]),
  mood:         bigint('mood', { mode: 'number' }),                      // 1–5, nullable
  attachments:  text('attachments').array().notNull().default([]), // Attachment UUIDs
  dirty:        boolean('dirty').notNull().default(false),
  deleted:      boolean('deleted').notNull().default(false),
  lastSyncedAt: bigint('last_synced_at', { mode: 'number' }),
  version:      bigint('version', { mode: 'number' }).notNull().default(1),
});

// ── attachments ───────────────────────────────────────────────────────────────
export const attachments = pgTable('attachments', {
  id:        text('id').primaryKey(),
  entryId:   text('entry_id').notNull().references(() => entries.id, { onDelete: 'cascade' }),
  type:      text('type').$type<'image' | 'audio'>().notNull(),
  url:       text('url').notNull(),
  createdAt: bigint('created_at', { mode: 'number' }).notNull(),
});
