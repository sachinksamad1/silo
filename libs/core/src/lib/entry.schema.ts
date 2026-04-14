import { z } from 'zod';

export const AttachmentSchema = z.object({
  id: z.string().uuid(),
  entryId: z.string().uuid(),
  type: z.enum(['image', 'audio', 'video', 'file']),
  url: z.string().url(),
  createdAt: z.number(),
});

export type Attachment = z.infer<typeof AttachmentSchema>;

export const EntrySchema = z.object({
  id: z.string().uuid(),
  content: z.any(), // TipTap JSON doc (encrypted blob in Phase 2)
  createdAt: z.number(),
  updatedAt: z.number(),
  tags: z.array(z.string()),
  mood: z.number().min(1).max(5).optional(),
  attachments: z.array(z.string().uuid()),
  dirty: z.boolean(),
  deleted: z.boolean(),
  lastSyncedAt: z.number().optional(),
  version: z.number().default(1),
});

export type Entry = z.infer<typeof EntrySchema>;

// Input schema for creation (omits managed fields)
export const CreateEntrySchema = EntrySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  dirty: true,
  deleted: true,
  lastSyncedAt: true,
  version: true,
});

export type CreateEntryInput = z.infer<typeof CreateEntrySchema>;

// Update schema
export const UpdateEntrySchema = CreateEntrySchema.partial();

export type UpdateEntryInput = z.infer<typeof UpdateEntrySchema>;
