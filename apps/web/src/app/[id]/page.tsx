'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TipTapEditor } from '../../components/TipTapEditor';
import { useJournal, useEntry } from '../../hooks/useJournal';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Trash2, Calendar } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function EditEntry() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const entry = useEntry(id);
  const { updateEntry, deleteEntry } = useJournal();
  
  const [content, setContent] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize content once entry is loaded
  useEffect(() => {
    if (entry && !content) {
      setContent(entry.content);
    }
  }, [entry, content]);

  const handleSave = async () => {
    if (!content || !entry) return;
    setIsSaving(true);
    
    try {
      await updateEntry(id, { content });
      setIsSaving(false);
    } catch (error) {
      console.error('Failed to update entry', error);
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this entry?')) {
      await deleteEntry(id);
      router.push('/');
    }
  };

  if (entry === undefined) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-pulse rounded-full bg-secondary h-12 w-12" />
      </div>
    );
  }

  if (entry === null) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-medium">Entry not found</h2>
        <Link href="/" className="text-primary mt-4 inline-block hover:underline">
          Return to Timeline
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col h-full relative"
    >
      <header className="sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background/80 backdrop-blur-xl pb-4 border-b">
        <div className="flex items-center">
          <Link 
            href="/" 
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors group mr-6"
          >
            <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Back
          </Link>
          <div className="hidden md:flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Entry
            </span>
            <span className="flex items-center text-sm font-medium">
              <Calendar className="mr-1.5 h-3.5 w-3.5 opacity-70" />
              {format(entry.createdAt, 'EEEE, MMMM d, yyyy')}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={handleDelete}
            className="flex items-center justify-center bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground h-10 w-10 md:w-auto md:px-4 rounded-full font-medium transition-all shadow-sm"
            aria-label="Delete Entry"
          >
            <Trash2 className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Delete</span>
          </button>
          <button
            onClick={handleSave}
            disabled={!content || isSaving}
            className="flex items-center bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-medium transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </header>
      
      <div className="mt-8 flex-1">
        <TipTapEditor initialContent={entry.content} onChange={setContent} />
      </div>
    </motion.div>
  );
}
