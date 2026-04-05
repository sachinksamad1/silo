'use client';

import { useEffect, useState } from 'react';
import { SyncEngine } from 'sync';
import { useJournal } from '../hooks/useJournal';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { cn } from './Sidebar';

const syncEngine = new SyncEngine();

export function SyncManager() {
  const { dirtyCount } = useJournal();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const performSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setError(null);
    
    try {
      await syncEngine.sync();
      setLastSynced(new Date());
    } catch (err) {
      console.error('Sync failed:', err);
      setError('Sync failed. Please check your connection.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Initial sync and periodic sync every 30 seconds
  useEffect(() => {
    performSync();
    
    const interval = setInterval(() => {
      performSync();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Also sync when we have new dirty entries
  useEffect(() => {
    if (dirtyCount > 0 && !isSyncing) {
      const timeout = setTimeout(() => performSync(), 2000);
      return () => clearTimeout(timeout);
    }
  }, [dirtyCount]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={performSync}
        disabled={isSyncing}
        className={cn(
          "group flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium shadow-lg transition-all border backdrop-blur-md",
          isSyncing 
            ? "bg-primary/10 border-primary/20 text-primary animate-pulse" 
            : error 
              ? "bg-destructive/10 border-destructive/20 text-destructive"
              : "bg-background/80 border-border hover:bg-background hover:shadow-xl"
        )}
      >
        {isSyncing ? (
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
        ) : error ? (
          <CloudOff className="h-3.5 w-3.5" />
        ) : (
          <Cloud className={cn("h-3.5 w-3.5", dirtyCount > 0 ? "text-amber-500" : "text-emerald-500")} />
        )}
        
        <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-xs group-hover:ml-1">
          {isSyncing ? 'Syncing...' : error ? 'Sync Error' : dirtyCount > 0 ? `${dirtyCount} pending` : 'Synced'}
        </span>
        
        {!isSyncing && !error && (
          <span className="ml-1 opacity-50 font-normal">
            {lastSynced ? lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
          </span>
        )}
      </button>
    </div>
  );
}
