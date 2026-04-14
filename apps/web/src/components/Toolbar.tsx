'use client';

import { Editor } from '@tiptap/react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Image as ImageIcon, 
  Video, 
  FileText,
  Link as LinkIcon,
  Youtube
} from 'lucide-react';

interface ToolbarProps {
  editor: Editor | null;
  onImageUpload: (file: File) => void;
  onVideoUpload: (file: File) => void;
  onFileUpload: (file: File) => void;
}

export function Toolbar({ editor, onImageUpload, onVideoUpload, onFileUpload }: ToolbarProps) {
  if (!editor) {
    return null;
  }

  const addYoutubeVideo = () => {
    const url = window.prompt('Enter YouTube URL');
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
      });
    }
  };

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onImageUpload(file);
      }
    };
    input.click();
  };

  const addVideo = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onVideoUpload(file);
      }
    };
    input.click();
  };

  const addFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onFileUpload(file);
      }
    };
    input.click();
  };

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-muted ${editor.isActive('bold') ? 'bg-muted text-primary' : ''}`}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-muted ${editor.isActive('italic') ? 'bg-muted text-primary' : ''}`}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </button>
      <div className="w-px h-6 bg-border mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-muted ${editor.isActive('bulletList') ? 'bg-muted text-primary' : ''}`}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-muted ${editor.isActive('orderedList') ? 'bg-muted text-primary' : ''}`}
        title="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-muted ${editor.isActive('blockquote') ? 'bg-muted text-primary' : ''}`}
        title="Blockquote"
      >
        <Quote className="h-4 w-4" />
      </button>
      <div className="w-px h-6 bg-border mx-1" />
      <button
        onClick={addLink}
        className={`p-2 rounded hover:bg-muted ${editor.isActive('link') ? 'bg-muted text-primary' : ''}`}
        title="Add Link"
      >
        <LinkIcon className="h-4 w-4" />
      </button>
      <button
        onClick={addImage}
        className="p-2 rounded hover:bg-muted"
        title="Insert Image"
      >
        <ImageIcon className="h-4 w-4" />
      </button>
      <button
        onClick={addVideo}
        className="p-2 rounded hover:bg-muted"
        title="Insert Video"
      >
        <Video className="h-4 w-4" />
      </button>
      <button
        onClick={addYoutubeVideo}
        className="p-2 rounded hover:bg-muted"
        title="Insert YouTube Video"
      >
        <Youtube className="h-4 w-4" />
      </button>
      <button
        onClick={addFile}
        className="p-2 rounded hover:bg-muted"
        title="Attach File"
      >
        <FileText className="h-4 w-4" />
      </button>
      <div className="flex-1" />
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 rounded hover:bg-muted disabled:opacity-50"
        disabled={!editor.can().undo()}
        title="Undo"
      >
        <Undo className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2 rounded hover:bg-muted disabled:opacity-50"
        disabled={!editor.can().redo()}
        title="Redo"
      >
        <Redo className="h-4 w-4" />
      </button>
    </div>
  );
}
