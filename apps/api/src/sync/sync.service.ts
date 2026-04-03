import { Injectable } from '@nestjs/common';
import { eq, gt, or } from 'drizzle-orm';
import { db } from '../db';
import { entries } from '../db/schema';
import { Entry, EntrySchema, PushPayload, PullResponse } from 'core';

@Injectable()
export class SyncService {

  /**
   * Bulk-upsert client entries into PostgreSQL.
   * Validates every entry with Zod before persisting.
   * Conflict strategy: Last-Write-Wins on updatedAt.
   */
  async push(payload: PushPayload): Promise<{ accepted: string[]; rejected: string[] }> {
    const accepted: string[] = [];
    const rejected: string[] = [];

    for (const raw of payload.entries) {
      // Validate with Zod — server never trusts client data blindly
      const parsed = EntrySchema.safeParse(raw);
      if (!parsed.success) {
        rejected.push(raw.id);
        continue;
      }

      const entry = parsed.data;

      // Check for existing record and apply LWW
      const [existing] = await db
        .select({ id: entries.id, updatedAt: entries.updatedAt })
        .from(entries)
        .where(eq(entries.id, entry.id))
        .limit(1);

      if (!existing || entry.updatedAt > existing.updatedAt) {
        await db
          .insert(entries)
          .values({
            id:           entry.id,
            content:      entry.content,
            createdAt:    entry.createdAt,
            updatedAt:    entry.updatedAt,
            tags:         entry.tags,
            mood:         entry.mood ?? null,
            attachments:  entry.attachments,
            dirty:        false,
            deleted:      entry.deleted,
            lastSyncedAt: Date.now(),
            version:      entry.version,
          })
          .onConflictDoUpdate({
            target: entries.id,
            set: {
              content:      entry.content,
              updatedAt:    entry.updatedAt,
              tags:         entry.tags,
              mood:         entry.mood ?? null,
              attachments:  entry.attachments,
              deleted:      entry.deleted,
              lastSyncedAt: Date.now(),
              version:      entry.version,
            },
          });
      }

      accepted.push(entry.id);
    }

    return { accepted, rejected };
  }

  /**
   * Pull all entries updated after `since` (unix ms).
   * Returns entries + current server time for clients to calibrate clock skew.
   */
  async pull(since?: number): Promise<PullResponse> {
    const rows = since
      ? await db.select().from(entries).where(
          or(
            gt(entries.updatedAt, since),
            gt(entries.lastSyncedAt!, since),
          )
        )
      : await db.select().from(entries);

    // Validate each row through Zod so the response is always well-typed
    const validEntries: Entry[] = rows
      .map(row => EntrySchema.safeParse(row))
      .filter(r => r.success)
      .map(r => (r as { success: true; data: Entry }).data);

    return {
      entries: validEntries,
      serverTime: Date.now(),
    };
  }
}
