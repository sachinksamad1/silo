import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useMemo, useState } from 'react';

import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type EntryEditorProps = {
  heading: string;
  subheading: string;
  initialText?: string;
  initialTags?: string[];
  initialMood?: number;
  saveLabel: string;
  saving?: boolean;
  onBack(): void;
  onSave(input: { text: string; tags: string[]; mood?: number }): Promise<void> | void;
  onDelete?(): void;
};

const MOOD_OPTIONS = [1, 2, 3, 4, 5] as const;

export function EntryEditor({
  heading,
  subheading,
  initialText = '',
  initialTags = [],
  initialMood,
  saveLabel,
  saving = false,
  onBack,
  onSave,
  onDelete,
}: EntryEditorProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [text, setText] = useState(initialText);
  const [tagsInput, setTagsInput] = useState(initialTags.join(', '));
  const [mood, setMood] = useState<number | undefined>(initialMood);

  useEffect(() => {
    setText(initialText);
    setTagsInput(initialTags.join(', '));
    setMood(initialMood);
  }, [initialMood, initialTags, initialText]);

  const parsedTags = useMemo(() => normalizeTags(tagsInput), [tagsInput]);
  const canSave = text.trim().length > 0 && !saving;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.heroRow}>
            <Pressable
              onPress={onBack}
              style={({ pressed }) => [
                styles.backButton,
                {
                  backgroundColor: pressed ? colors.surfaceAlt : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.backButtonText, { color: colors.text }]}>Back</Text>
            </Pressable>
            {onDelete ? (
              <Pressable
                onPress={onDelete}
                style={({ pressed }) => [
                  styles.deleteButton,
                  {
                    backgroundColor: pressed ? colors.danger : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.deleteButtonText, { color: colors.danger }]}>Archive</Text>
              </Pressable>
            ) : null}
          </View>

          <View style={styles.headerBlock}>
            <Text style={[styles.heading, { color: colors.text }]}>{heading}</Text>
            <Text style={[styles.subheading, { color: colors.muted }]}>{subheading}</Text>
          </View>

          <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>Body</Text>
            <TextInput
              multiline
              autoFocus
              value={text}
              onChangeText={setText}
              placeholder="Write what the day feels like while it's still warm."
              placeholderTextColor={colors.muted}
              style={[styles.bodyInput, { color: colors.text }]}
              textAlignVertical="top"
            />
          </View>

          <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>Mood</Text>
            <View style={styles.moodRow}>
              {MOOD_OPTIONS.map((value) => {
                const selected = mood === value;
                return (
                  <Pressable
                    key={value}
                    onPress={() => setMood((current) => (current === value ? undefined : value))}
                    style={({ pressed }) => [
                      styles.moodButton,
                      {
                        backgroundColor: selected
                          ? colors.accentSoft
                          : pressed
                            ? colors.surfaceAlt
                            : colors.background,
                        borderColor: selected ? colors.accent : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.moodNumber,
                        { color: selected ? colors.accent : colors.text },
                      ]}
                    >
                      {value}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>Tags</Text>
            <TextInput
              value={tagsInput}
              onChangeText={setTagsInput}
              placeholder="reflection, travel, family"
              placeholderTextColor={colors.muted}
              style={[styles.tagsInput, { color: colors.text }]}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {parsedTags.length > 0 ? (
              <View style={styles.tagsPreviewRow}>
                {parsedTags.map((tag) => (
                  <View
                    key={tag}
                    style={[
                      styles.tagChip,
                      { backgroundColor: colors.background, borderColor: colors.border },
                    ]}
                  >
                    <Text style={[styles.tagChipText, { color: colors.muted }]}>{tag}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </ScrollView>

        <View
          style={[
            styles.footer,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
            },
          ]}
        >
          <Pressable
            disabled={!canSave}
            onPress={() => {
              void Promise.resolve(
                onSave({
                  text,
                  tags: parsedTags,
                  mood,
                })
              );
            }}
            style={({ pressed }) => [
              styles.saveButton,
              {
                backgroundColor: canSave
                  ? pressed
                    ? colors.accent
                    : colors.tint
                  : colors.surfaceAlt,
              },
            ]}
          >
            <Text
              style={[
                styles.saveButtonText,
                { color: canSave ? colors.surface : colors.muted },
              ]}
            >
              {saving ? 'Saving…' : saveLabel}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function normalizeTags(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .filter((tag, index, array) => array.indexOf(tag) === index);
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 16,
  },
  heroRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButtonText: {
    fontFamily: Fonts.rounded,
    fontSize: 14,
    lineHeight: 18,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  deleteButton: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  deleteButtonText: {
    fontFamily: Fonts.rounded,
    fontSize: 14,
    lineHeight: 18,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  headerBlock: {
    gap: 8,
  },
  heading: {
    fontFamily: Fonts.display,
    fontSize: 34,
    lineHeight: 40,
  },
  subheading: {
    fontFamily: Fonts.body,
    fontSize: 15,
    lineHeight: 22,
  },
  panel: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    gap: 14,
  },
  sectionLabel: {
    fontFamily: Fonts.rounded,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  bodyInput: {
    minHeight: 260,
    fontFamily: Fonts.display,
    fontSize: 24,
    lineHeight: 34,
  },
  moodRow: {
    flexDirection: 'row',
    gap: 10,
  },
  moodButton: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },
  moodNumber: {
    fontFamily: Fonts.rounded,
    fontSize: 18,
    lineHeight: 22,
  },
  tagsInput: {
    fontFamily: Fonts.body,
    fontSize: 16,
    lineHeight: 22,
    paddingVertical: 0,
  },
  tagsPreviewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagChipText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 14,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
    borderTopWidth: 1,
  },
  saveButton: {
    borderRadius: 22,
    paddingVertical: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: Fonts.rounded,
    fontSize: 15,
    lineHeight: 18,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
