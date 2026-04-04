import { useLiveQuery } from 'dexie-react-hooks';
import { EntryRepository } from 'storage';
import { CreateEntryInput, UpdateEntryInput } from 'core';

const entryRepo = new EntryRepository();

export function useJournal() {
  // Fetch all active entries, observing changes dynamically
  const entries = useLiveQuery(() => entryRepo.getAll(), [], []);

  // Fetch dirty entries count, just to show sync status if needed
  const dirtyCount = useLiveQuery(
    async () => {
      const dirtyEntries = await entryRepo.getDirty();
      return dirtyEntries.length;
    },
    [],
    0
  );

  const addEntry = async (input: CreateEntryInput) => {
    return entryRepo.create(input);
  };

  const updateEntry = async (id: string, updates: UpdateEntryInput) => {
    return entryRepo.update(id, updates);
  };

  const deleteEntry = async (id: string) => {
    return entryRepo.delete(id);
  };

  return {
    entries,
    dirtyCount,
    addEntry,
    updateEntry,
    deleteEntry,
  };
}

export function useEntry(id: string | null) {
  const entry = useLiveQuery(
    () => (id ? entryRepo.getById(id) : Promise.resolve(undefined)),
    [id]
  );
  return entry;
}
