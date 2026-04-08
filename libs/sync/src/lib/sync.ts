import { EntryRepository } from 'storage';
import { api } from 'api-client';

export class SyncEngine {
  private repo = new EntryRepository();

  async push() {
    const dirty = await this.repo.getDirty();
    if (dirty.length === 0) return;

    console.log(`Pushing ${dirty.length} local changes...`);

    try {
      await api.pushEntries(dirty);
      await this.repo.markSynced(dirty.map(e => e.id));
    } catch (error) {
      console.error('Push failed', error);
      throw error; // Rethrow to propagate to UI
    }
  }

  async pull() {
    console.log('Pulling remote changes...');
    try {
      // For MVP, we use LWW and we don't store since timestamp locally yet
      // but the API supports it.
      const response = await api.pullEntries();
      const remoteEntries = response.data?.entries;

      if (remoteEntries && Array.isArray(remoteEntries) && remoteEntries.length > 0) {
        await this.repo.bulkUpsert(remoteEntries);
      }
    } catch (error) {
      console.error('Pull failed', error);
      throw error; // Rethrow to propagate to UI
    }
  }

  async sync() {
    await this.push();
    await this.pull();
  }
}
