import { pgTable, text, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

// ── entries ───────────────────────────────────────────────────────────────────
// Mirrors libs/core EntrySchema exactly.
// content is jsonb to support TipTap JSON docs and future encrypted blobs.
export const entries = pgTable('entries', {
  id:           text('id').primaryKey(),
  content:      jsonb('content').notNull(),          // TipTap JSON / encrypted blob (Phase 2)
  createdAt:    integer('created_at').notNull(),      // Unix ms
  updatedAt:    integer('updated_at').notNull(),      // Unix ms — used for LWW
  tags:         text('tags').array().notNull().default([]),
  mood:         integer('mood'),                      // 1–5, nullable
  attachments:  text('attachments').array().notNull().default([]), // Attachment UUIDs
  dirty:        boolean('dirty').notNull().default(false),
  deleted:      boolean('deleted').notNull().default(false),
  lastSyncedAt: integer('last_synced_at'),
  version:      integer('version').notNull().default(1),
});

// ── attachments ───────────────────────────────────────────────────────────────
export const attachments = pgTable('attachments', {
  id:        text('id').primaryKey(),
  entryId:   text('entry_id').notNull().references(() => entries.id, { onDelete: 'cascade' }),
  type:      text('type').$type<'image' | 'audio'>().notNull(),
  url:       text('url').notNull(),
  createdAt: integer('created_at').notNull(),
});
