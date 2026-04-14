import { ApiClient } from 'api-client';
import { CreateEntryInput, Entry, UpdateEntryInput } from 'core';
import { useSQLiteContext } from 'expo-sqlite';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { NativeEntryRepository, type NativeSQLiteDatabase } from 'storage';
import { SyncEngine } from 'sync';

type JournalContextValue = {
  ready: boolean;
  entries: Entry[];
  dirtyCount: number;
  apiUrl: string;
  isSyncing: boolean;
  syncError: string | null;
  lastSyncedAt: number | null;
  refresh(): Promise<void>;
  getEntry(id: string): Promise<Entry | undefined>;
  addEntry(input: CreateEntryInput): Promise<Entry>;
  updateEntry(id: string, updates: UpdateEntryInput): Promise<Entry | undefined>;
  deleteEntry(id: string): Promise<void>;
  syncNow(): Promise<boolean>;
  setApiUrl(next: string): void;
};

const env = (
  globalThis as typeof globalThis & {
    process?: {
      env?: Record<string, string | undefined>;
    };
  }
).process?.env;

const defaultApiUrl = env?.EXPO_PUBLIC_API_URL ?? env?.NEXT_PUBLIC_API_URL ?? '';

const JournalContext = createContext<JournalContextValue | null>(null);

export function JournalProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext() as NativeSQLiteDatabase;
  const repo = useMemo(() => new NativeEntryRepository(db), [db]);

  const [ready, setReady] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [dirtyCount, setDirtyCount] = useState(0);
  const [apiUrl, setApiUrlState] = useState(defaultApiUrl);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    const [nextEntries, dirtyEntries] = await Promise.all([repo.getAll(), repo.getDirty()]);
    setEntries(nextEntries);
    setDirtyCount(dirtyEntries.length);
  }, [repo]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const [nextEntries, dirtyEntries] = await Promise.all([repo.getAll(), repo.getDirty()]);

        if (cancelled) {
          return;
        }

        setEntries(nextEntries);
        setDirtyCount(dirtyEntries.length);
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [repo]);

  const addEntry = useCallback(
    async (input: CreateEntryInput) => {
      const created = await repo.create(input);
      await refresh();
      return created;
    },
    [refresh, repo]
  );

  const updateEntry = useCallback(
    async (id: string, updates: UpdateEntryInput) => {
      const updated = await repo.update(id, updates);
      await refresh();
      return updated;
    },
    [refresh, repo]
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      await repo.delete(id);
      await refresh();
    },
    [refresh, repo]
  );

  const getEntry = useCallback(
    async (id: string) => {
      return repo.getById(id);
    },
    [repo]
  );

  const syncNow = useCallback(async () => {
    const trimmedApiUrl = apiUrl.trim();
    if (!trimmedApiUrl) {
      setSyncError('Enter an API URL before syncing.');
      return false;
    }

    setIsSyncing(true);
    setSyncError(null);

    try {
      const engine = new SyncEngine(repo, new ApiClient(trimmedApiUrl));
      await engine.sync();
      await refresh();
      setLastSyncedAt(Date.now());
      return true;
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Sync failed.');
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [apiUrl, refresh, repo]);

  const setApiUrl = useCallback((next: string) => {
    setApiUrlState(next);
    setSyncError(null);
  }, []);

  const value = useMemo<JournalContextValue>(
    () => ({
      ready,
      entries,
      dirtyCount,
      apiUrl,
      isSyncing,
      syncError,
      lastSyncedAt,
      refresh,
      getEntry,
      addEntry,
      updateEntry,
      deleteEntry,
      syncNow,
      setApiUrl,
    }),
    [
      addEntry,
      apiUrl,
      deleteEntry,
      dirtyCount,
      entries,
      getEntry,
      isSyncing,
      lastSyncedAt,
      ready,
      refresh,
      setApiUrl,
      syncError,
      syncNow,
      updateEntry,
    ]
  );

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}

export function useJournal() {
  const context = useContext(JournalContext);

  if (!context) {
    throw new Error('useJournal must be used inside JournalProvider');
  }

  return context;
}
