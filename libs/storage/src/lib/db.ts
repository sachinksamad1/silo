import { JournalDB } from './schema'

export const db = new JournalDB()

/**
 * Ensures the database is opened.
 * Useful for checking connectivity or running migrations.
 */
export async function initStorage() {
  if (!db.isOpen()) {
    await db.open()
  }
  return db
}

/**
 * Completely clears the local database.
 * Use only for development/reset scenarios.
 */
export async function resetStorage() {
  await db.delete()
  await db.open()
}
