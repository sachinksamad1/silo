import Dexie, { Table } from 'dexie'
import { Entry, Attachment } from 'core'

export type { Entry as EntryEntity, Attachment as AttachmentEntity }

export class JournalDB extends Dexie {
  entries!: Table<Entry, string>
  attachments!: Table<Attachment, string>

  constructor() {
    super('journal-db')

    this.version(1).stores({
      // Primary key: id
      // Indexes:
      // updatedAt → timeline
      // dirty → sync queue
      // deleted → soft delete
      // tags → filtering
      entries: `
        id,
        updatedAt,
        createdAt,
        dirty,
        deleted,
        *tags
      `,

      attachments: `
        id,
        entryId,
        createdAt
      `
    })
  }
}