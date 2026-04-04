'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Tag, Smile } from 'lucide-react';
import type { Entry } from 'core';

export function EntryCard({ entry }: { entry: Entry }) {
  // Extract text from TipTap JSON safely
  const extractTextPreview = (content: any): string => {
    try {
      if (!content || !content.content) return 'Empty entry...';
      let text = '';
      for (const block of content.content) {
        if (block.type === 'paragraph' && block.content) {
          text += block.content.map((c: any) => c.text).join('') + ' ';
        }
      }
      return text.trim() ? `${text.trim().substring(0, 140)}...` : 'Empty entry...';
    } catch {
      return '(Encrypted or complex content)';
    }
  };

  const formattedDate = format(entry.createdAt, 'EEEE, MMMM d, yyyy');
  const formattedTime = format(entry.updatedAt, 'h:mm a');

  return (
    <Link href={`/${entry.id}`} passHref>
      <motion.div
        whileHover={{ scale: 1.01, translateY: -2 }}
        whileTap={{ scale: 0.99 }}
        className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-6 shadow-sm backdrop-blur-md transition-all hover:bg-card/80 hover:shadow-md"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-white/5" />
        
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="flex items-center text-sm font-medium text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4 opacity-70" />
              {formattedDate}
            </h3>
          </div>
          <span className="text-xs text-muted-foreground opacity-60">
            {formattedTime}
          </span>
        </div>

        <p className="relative z-10 mt-4 line-clamp-3 text-base leading-relaxed text-foreground opacity-90">
          {extractTextPreview(entry.content)}
        </p>

        {(entry.tags.length > 0 || entry.mood) && (
          <div className="relative z-10 mt-6 flex flex-wrap items-center gap-3">
            {entry.mood !== undefined && (
              <span className="flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground shadow-sm">
                <Smile className="mr-1.5 h-3.5 w-3.5 text-primary" />
                Mood: {entry.mood}/5
              </span>
            )}
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center rounded-full border border-border/50 bg-background/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm"
              >
                <Tag className="mr-1.5 h-3 w-3 opacity-50" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </Link>
  );
}
