import { z } from 'zod';
import { EntrySchema } from './entry.schema';

// ── Push ──────────────────────────────────────────────────────────────────────
// Payload sent from client → POST /sync/push
export const PushPayloadSchema = z.object({
  entries: z.array(EntrySchema),
});

export type PushPayload = z.infer<typeof PushPayloadSchema>;

export const PushResponseSchema = z.object({
  accepted: z.array(z.string().uuid()), // IDs the server accepted
  rejected: z.array(z.string().uuid()), // IDs the server rejected (e.g. validation failure)
});

export type PushResponse = z.infer<typeof PushResponseSchema>;

// ── Pull ──────────────────────────────────────────────────────────────────────
// Response from GET /sync/pull?since=<timestamp>
export const PullResponseSchema = z.object({
  entries: z.array(EntrySchema),
  serverTime: z.number(), // server unix ms — clients can use this to avoid clock skew
});

export type PullResponse = z.infer<typeof PullResponseSchema>;
