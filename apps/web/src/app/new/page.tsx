'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TipTapEditor } from '../../components/TipTapEditor';
import { useJournal } from '../../hooks/useJournal';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewEntry() {
  const router = useRouter();
  const { addEntry } = useJournal();
  const [content, setContent] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!content) return;
    setIsSaving(true);
    
    try {
      await addEntry({
        content,
        tags: [],
        attachments: [],
        mood: undefined
      });
      router.push('/');
    } catch (error) {
      console.error('Failed to save entry', error);
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col h-full relative"
    >
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background/80 backdrop-blur-xl pb-4 border-b">
        <Link 
          href="/" 
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
          Back
        </Link>
        <button
          onClick={handleSave}
          disabled={!content || isSaving}
          className="flex items-center bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-medium transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Entry'}
        </button>
      </header>
      
      <div className="mt-8 flex-1">
        <TipTapEditor onChange={setContent} />
      </div>
    </motion.div>
  );
}
