import { useRouter } from 'expo-router';
import { useState } from 'react';

import { EntryEditor } from '@/components/journal/entry-editor';
import { plainTextToDoc } from '@/lib/journal-content';
import { useJournal } from '@/providers/journal-provider';

export default function ComposeScreen() {
  const router = useRouter();
  const { addEntry } = useJournal();
  const [saving, setSaving] = useState(false);

  return (
    <EntryEditor
      heading="New Page"
      subheading="Capture it locally now. You can sync it when the network and API are both ready."
      saveLabel="Save Page"
      saving={saving}
      onBack={() => router.back()}
      onSave={async ({ text, tags, mood }) => {
        setSaving(true);

        try {
          const created = await addEntry({
            content: plainTextToDoc(text),
            tags,
            mood,
            attachments: [],
          });

          router.replace({
            pathname: '/entry/[id]',
            params: { id: created.id },
          });
        } finally {
          setSaving(false);
        }
      }}
    />
  );
}
