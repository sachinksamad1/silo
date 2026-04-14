import { useLocalSearchParams, useRouter } from 'expo-router';
import { Entry } from 'core';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EntryEditor } from '@/components/journal/entry-editor';
import { Colors, Fonts } from '@/constants/theme';
import { formatEntryDate } from '@/lib/date';
import { docToPlainText, plainTextToDoc } from '@/lib/journal-content';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useJournal } from '@/providers/journal-provider';

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const entryId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { getEntry, updateEntry, deleteEntry } = useJournal();

  const [entry, setEntry] = useState<Entry | null | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const loaded = entryId ? await getEntry(entryId) : undefined;
      if (!cancelled) {
        setEntry(loaded ?? null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [entryId, getEntry]);

  if (entry === undefined) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.tint} />
      </SafeAreaView>
    );
  }

  if (entry === null) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: colors.background }]}>
        <View style={[styles.missingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.missingTitle, { color: colors.text }]}>Entry not found</Text>
          <Text style={[styles.missingCopy, { color: colors.muted }]}>This page was deleted locally or has not been loaded into the journal yet.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <EntryEditor
      heading={formatEntryDate(entry.createdAt)}
      subheading="Edits stay local first and are marked for the next sync pass."
      initialText={docToPlainText(entry.content)}
      initialTags={entry.tags}
      initialMood={entry.mood}
      saveLabel="Save Changes"
      saving={saving}
      onBack={() => router.back()}
      onDelete={() => {
        Alert.alert('Archive entry?', 'The entry will stay local as a soft delete until the next sync.', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Archive',
            style: 'destructive',
            onPress: () => {
              void (async () => {
                await deleteEntry(entry.id);
                router.replace('/');
              })();
            },
          },
        ]);
      }}
      onSave={async ({ text, tags, mood }) => {
        setSaving(true);

        try {
          const updated = await updateEntry(entry.id, {
            content: plainTextToDoc(text),
            tags,
            mood,
            attachments: entry.attachments,
          });

          if (updated) {
            setEntry(updated);
          }
        } finally {
          setSaving(false);
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  missingCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    gap: 10,
  },
  missingTitle: {
    fontFamily: Fonts.display,
    fontSize: 30,
    lineHeight: 34,
  },
  missingCopy: {
    fontFamily: Fonts.body,
    fontSize: 15,
    lineHeight: 22,
  },
});
