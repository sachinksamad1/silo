export type JournalDoc = {
  type: 'doc';
  content: Array<
    | {
        type: 'paragraph';
        content?: Array<{
          type: 'text';
          text: string;
        }>;
      }
    | {
        type: string;
        [key: string]: unknown;
      }
  >;
};

export const EMPTY_DOC: JournalDoc = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
    },
  ],
};

export function plainTextToDoc(text: string): JournalDoc {
  const normalized = text.replace(/\r\n/g, '\n').trim();

  if (!normalized) {
    return EMPTY_DOC;
  }

  const paragraphs = normalized
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => ({
      type: 'paragraph' as const,
      content: [
        {
          type: 'text' as const,
          text: paragraph,
        },
      ],
    }));

  return {
    type: 'doc',
    content: paragraphs.length > 0 ? paragraphs : EMPTY_DOC.content,
  };
}

export function docToPlainText(content: unknown): string {
  if (!content || typeof content !== 'object') {
    return '';
  }

  const maybeDoc = content as { content?: Array<{ type?: string; content?: Array<{ text?: string }> }> };
  if (!Array.isArray(maybeDoc.content)) {
    return '';
  }

  return maybeDoc.content
    .flatMap((node) => {
      if (node.type !== 'paragraph') {
        return [];
      }

      if (!Array.isArray(node.content)) {
        return [''];
      }

      return [
        node.content
          .map((child) => (typeof child.text === 'string' ? child.text : ''))
          .join(''),
      ];
    })
    .join('\n')
    .trim();
}

export function extractPreview(content: unknown, limit = 160) {
  const text = docToPlainText(content).replace(/\s+/g, ' ').trim();

  if (!text) {
    return 'A quiet page waiting for the next thought.';
  }

  if (text.length <= limit) {
    return text;
  }

  return `${text.slice(0, limit).trimEnd()}…`;
}

export function countWords(content: unknown) {
  const text = docToPlainText(content).trim();
  if (!text) {
    return 0;
  }

  return text.split(/\s+/).length;
}
