import { Attachment } from 'core';
import { v4 as uuid } from 'uuid';

async function getWebDb() {
  const { db } = await import('../db');
  return db;
}

export class AttachmentRepository {
  async create(input: {
    entryId: string;
    type: Attachment['type'];
    file: Blob;
  }): Promise<Attachment> {
    const db = await getWebDb();
    const id = uuid();

    const attachment: Attachment = {
      id,
      entryId: input.entryId,
      type: input.type,
      url:
        typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function'
          ? URL.createObjectURL(input.file)
          : '',
      createdAt: Date.now(),
    };

    await db.attachments.add(attachment);
    return attachment;
  }

  async getByEntryId(entryId: string): Promise<Attachment[]> {
    const db = await getWebDb();
    return db.attachments.where('entryId').equals(entryId).toArray();
  }

  async getById(id: string): Promise<Attachment | undefined> {
    const db = await getWebDb();
    return db.attachments.get(id);
  }
}
