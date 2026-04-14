import { ApiClient, api } from 'api-client';
import { Entry } from 'core';
import { EntryRepository, EntryRepositoryLike } from 'storage';

export class SyncEngine {
  constructor(
    private readonly repo: Pick<
      EntryRepositoryLike,
      'getDirty' | 'markSynced' | 'bulkUpsert'
    > = new EntryRepository(),
    private readonly client: Pick<ApiClient, 'pushEntries' | 'pullEntries'> = api
  ) {}

  async push() {
    const dirty = await this.repo.getDirty();
    if (dirty.length === 0) return;

    console.log(`Pushing ${dirty.length} local changes...`);

    try {
      await this.client.pushEntries(dirty);
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
      const response = await this.client.pullEntries();
      const remoteEntries = response.data?.entries;

      if (isEntryArray(remoteEntries) && remoteEntries.length > 0) {
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

function isEntryArray(entries: unknown): entries is Entry[] {
  return Array.isArray(entries);
}
