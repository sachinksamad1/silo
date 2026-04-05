import { SyncService } from '../apps/api/src/sync/sync.service';
import { EntrySchema } from '../libs/core/src/lib/entry.schema';
import * as crypto from 'crypto';

async function run() {
  const syncService = new SyncService();
  
  const entryId = crypto.randomUUID();
  const now = Date.now();
  
  const payload = {
    entries: [
      {
        id: entryId,
        content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Test Entry' }] }] },
        createdAt: now,
        updatedAt: now,
        tags: ['test'],
        mood: 5,
        attachments: [],
        dirty: true,
        deleted: false,
        version: 1,
      },
    ],
  };

  console.log('Testing PushPayload validation...');
  const result = EntrySchema.safeParse(payload.entries[0]);
  if (!result.success) {
    console.error('Validation failed:', result.error.format());
  } else {
    console.log('Validation successful!');
  }

  try {
    console.log('Attempting to push entry via SyncService...');
    const response = await syncService.push(payload as any);
    console.log('Push response:', response);
  } catch (error) {
    console.error('Error during push:', error);
  }
}

run();
