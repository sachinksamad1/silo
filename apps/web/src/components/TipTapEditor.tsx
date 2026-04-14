'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import { useEffect, useState } from 'react';
import { Toolbar } from './Toolbar';
import { AttachmentRepository } from 'storage';

const attachmentRepo = new AttachmentRepository();

interface TipTapEditorProps {
  initialContent?: any;
  initialAttachments?: string[];
  onChange: (content: any, attachmentIds: string[]) => void;
  entryId?: string; // Optional entry ID if we're editing
}

export function TipTapEditor({ initialContent, initialAttachments = [], onChange, entryId }: TipTapEditorProps) {
  const [attachmentIds, setAttachmentIds] = useState<string[]>(initialAttachments);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'What’s on your mind? ...',
        emptyEditorClass: 'is-editor-empty',
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4 border shadow-sm cursor-pointer hover:ring-2 hover:ring-primary transition-all',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Youtube.configure({
        width: 640,
        height: 480,
        HTMLAttributes: {
          class: 'rounded-lg overflow-hidden my-4 shadow-sm aspect-video w-full h-auto',
        },
      }),
    ],
    content: initialContent || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'tiptap min-h-[500px] outline-none px-4 py-6 text-lg leading-relaxed prose prose-lg dark:prose-invert max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON(), attachmentIds);
    },
  });

  // Keep editor state in sync if initialContent changes (only useful for first load after fetch)
  useEffect(() => {
    if (editor && initialContent && editor.isEmpty) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  // Notify parent when attachmentIds change
  useEffect(() => {
    if (editor) {
      onChange(editor.getJSON(), attachmentIds);
    }
  }, [attachmentIds]);

  const handleImageUpload = async (file: File) => {
    if (!editor) return;

    // In a real app, we'd upload this to a server or store it in Dexie
    // For now, we'll use a local URL and store it as an attachment
    const attachment = await attachmentRepo.create({
      entryId: entryId || 'temp', // Use 'temp' if we don't have an ID yet
      type: 'image',
      file: file
    });

    setAttachmentIds(prev => [...prev, attachment.id]);

    editor.chain().focus().setImage({ src: attachment.url }).run();
  };

  const handleVideoUpload = async (file: File) => {
    if (!editor) return;

    // Since generic video extension isn't standard in Tiptap core, 
    // we'll treat it as a file attachment for now, or just alert.
    // Ideally we'd have a custom Video extension.
    
    const attachment = await attachmentRepo.create({
      entryId: entryId || 'temp',
      type: 'video',
      file: file
    });

    setAttachmentIds(prev => [...prev, attachment.id]);
    
    // We'll insert a link for now, as we don't have a custom video node
    editor.chain().focus().setLink({ href: attachment.url }).insertContent(`📹 Video: ${file.name}`).run();
  };

  const handleFileUpload = async (file: File) => {
    if (!editor) return;

    const attachment = await attachmentRepo.create({
      entryId: entryId || 'temp',
      type: 'file',
      file: file
    });

    setAttachmentIds(prev => [...prev, attachment.id]);

    editor.chain().focus().setLink({ href: attachment.url }).insertContent(`📎 Attachment: ${file.name}`).run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-4xl rounded-2xl border bg-card shadow-sm overflow-hidden flex flex-col">
      <Toolbar 
        editor={editor} 
        onImageUpload={handleImageUpload}
        onVideoUpload={handleVideoUpload}
        onFileUpload={handleFileUpload}
      />
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
