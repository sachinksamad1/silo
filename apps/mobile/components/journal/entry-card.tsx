import { Entry } from 'core';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';
import { formatEntryDateShort, formatEntryTime } from '@/lib/date';
import { countWords, extractPreview } from '@/lib/journal-content';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function EntryCard({
  entry,
  onPress,
}: {
  entry: Entry;
  onPress(): void;
}) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const wordCount = countWords(entry.content);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: pressed ? colors.surfaceAlt : colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.date, { color: colors.text }]}>{formatEntryDateShort(entry.createdAt)}</Text>
          <Text style={[styles.time, { color: colors.muted }]}>{formatEntryTime(entry.updatedAt)}</Text>
        </View>
        <View style={styles.headerMeta}>
          {entry.dirty ? (
            <View style={[styles.pill, { backgroundColor: colors.accentSoft }]}>
              <Text style={[styles.pillText, { color: colors.accent }]}>Queued</Text>
            </View>
          ) : null}
          <View style={[styles.dot, { backgroundColor: moodColor(entry.mood, colors) }]} />
        </View>
      </View>

      <Text style={[styles.preview, { color: colors.text }]}>{extractPreview(entry.content)}</Text>

      <View style={styles.footerRow}>
        <Text style={[styles.metaText, { color: colors.muted }]}>{wordCount} words</Text>
        <Text style={[styles.metaText, { color: colors.muted }]}>v{entry.version}</Text>
      </View>

      {entry.tags.length > 0 ? (
        <View style={styles.tagsRow}>
          {entry.tags.slice(0, 3).map((tag) => (
            <View key={tag} style={[styles.tag, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <Text style={[styles.tagText, { color: colors.muted }]}>{tag}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </Pressable>
  );
}

function moodColor(mood: number | undefined, colors: typeof Colors.light) {
  switch (mood) {
    case 1:
      return colors.danger;
    case 2:
      return colors.warning;
    case 3:
      return colors.tint;
    case 4:
      return colors.accent;
    case 5:
      return colors.success;
    default:
      return colors.border;
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    gap: 16,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerMeta: {
    alignItems: 'flex-end',
    gap: 10,
  },
  date: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    lineHeight: 20,
  },
  time: {
    marginTop: 4,
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 16,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: {
    fontFamily: Fonts.rounded,
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 999,
  },
  preview: {
    fontFamily: Fonts.display,
    fontSize: 22,
    lineHeight: 31,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 14,
  },
});
