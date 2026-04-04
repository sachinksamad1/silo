'use client';

import { useJournal } from '../hooks/useJournal';
import { EntryCard } from '../components/EntryCard';
import { motion } from 'framer-motion';

export default function Timeline() {
  const { entries } = useJournal();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col gap-8"
    >
      <header className="mb-4">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Timeline</h1>
        <p className="text-muted-foreground text-lg">
          Your thoughts, beautifully preserved.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entries && entries.length > 0 ? (
          entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))
        ) : (
          <div className="col-span-full py-24 text-center">
            <h3 className="text-2xl font-medium text-foreground/80 mb-2">
              No entries yet
            </h3>
            <p className="text-muted-foreground">
              Your journal is empty. What's on your mind today?
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
