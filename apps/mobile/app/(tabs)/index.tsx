import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EntryCard } from '@/components/journal/entry-card';
import { Colors, Fonts } from '@/constants/theme';
import { formatEntryDate, formatRelativeSync } from '@/lib/date';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useJournal } from '@/providers/journal-provider';

export default function TimelineScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { entries, dirtyCount, lastSyncedAt, ready } = useJournal();

  const latestEntry = entries[0];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.orbLarge, { backgroundColor: colors.accentSoft }]} />
      <View style={[styles.orbSmall, { backgroundColor: colors.surfaceAlt }]} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroRow}>
          <View style={styles.heroTextBlock}>
            <Text style={[styles.eyebrow, { color: colors.muted }]}>Local-first journal</Text>
            <Text style={[styles.heroTitle, { color: colors.text }]}>Silo</Text>
            <Text style={[styles.heroCopy, { color: colors.muted }]}>Every entry lands on-device first, ready for sync when you are.</Text>
          </View>

          <Pressable
            onPress={() => router.push('/compose')}
            style={({ pressed }) => [
              styles.composeButton,
              { backgroundColor: pressed ? colors.accent : colors.tint },
            ]}
          >
            <Text style={[styles.composeButtonText, { color: colors.surface }]}>New Page</Text>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Entries</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{entries.length}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Queued</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{dirtyCount}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Last Sync</Text>
            <Text style={[styles.statValueSmall, { color: colors.text }]}>{formatRelativeSync(lastSyncedAt)}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Pages</Text>
          <Text style={[styles.sectionCaption, { color: colors.muted }]}>
            {latestEntry ? formatEntryDate(latestEntry.updatedAt) : 'Start your first entry'}
          </Text>
        </View>

        {!ready ? (
          <View style={[styles.loadingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ActivityIndicator color={colors.tint} />
          </View>
        ) : entries.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No pages yet</Text>
            <Text style={[styles.emptyCopy, { color: colors.muted }]}>Start with a quick reflection, a travel note, or the sentence you do not want to lose.</Text>
            <Pressable
              onPress={() => router.push('/compose')}
              style={({ pressed }) => [
                styles.emptyButton,
                { backgroundColor: pressed ? colors.accent : colors.tint },
              ]}
            >
              <Text style={[styles.emptyButtonText, { color: colors.surface }]}>Write the first one</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.list}>
            {entries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onPress={() =>
                  router.push({
                    pathname: '/entry/[id]',
                    params: { id: entry.id },
                  })
                }
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  orbLarge: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 999,
    top: -120,
    right: -90,
    opacity: 0.65,
  },
  orbSmall: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 999,
    top: 240,
    left: -80,
    opacity: 0.55,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 160,
    gap: 22,
  },
  heroRow: {
    gap: 18,
    marginTop: 8,
  },
  heroTextBlock: {
    gap: 6,
  },
  eyebrow: {
    fontFamily: Fonts.rounded,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontFamily: Fonts.display,
    fontSize: 56,
    lineHeight: 58,
  },
  heroCopy: {
    maxWidth: 320,
    fontFamily: Fonts.body,
    fontSize: 16,
    lineHeight: 24,
  },
  composeButton: {
    alignSelf: 'flex-start',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  composeButtonText: {
    fontFamily: Fonts.rounded,
    fontSize: 15,
    lineHeight: 18,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  statLabel: {
    fontFamily: Fonts.rounded,
    fontSize: 12,
    lineHeight: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  statValue: {
    fontFamily: Fonts.display,
    fontSize: 28,
    lineHeight: 32,
  },
  statValueSmall: {
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionHeader: {
    gap: 4,
  },
  sectionTitle: {
    fontFamily: Fonts.display,
    fontSize: 30,
    lineHeight: 34,
  },
  sectionCaption: {
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  loadingCard: {
    minHeight: 180,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 24,
    gap: 14,
  },
  emptyTitle: {
    fontFamily: Fonts.display,
    fontSize: 32,
    lineHeight: 36,
  },
  emptyCopy: {
    fontFamily: Fonts.body,
    fontSize: 16,
    lineHeight: 24,
  },
  emptyButton: {
    alignSelf: 'flex-start',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyButtonText: {
    fontFamily: Fonts.rounded,
    fontSize: 14,
    lineHeight: 18,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  list: {
    gap: 14,
  },
});
