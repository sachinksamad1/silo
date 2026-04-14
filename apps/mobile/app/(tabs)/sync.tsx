import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts } from '@/constants/theme';
import { formatRelativeSync } from '@/lib/date';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useJournal } from '@/providers/journal-provider';

export default function SyncScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const {
    apiUrl,
    setApiUrl,
    syncNow,
    isSyncing,
    syncError,
    dirtyCount,
    entries,
    lastSyncedAt,
  } = useJournal();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.headerBlock}>
          <Text style={[styles.eyebrow, { color: colors.muted }]}>Sync mediator</Text>
          <Text style={[styles.title, { color: colors.text }]}>Bring the archive online</Text>
          <Text style={[styles.copy, { color: colors.muted }]}>The mobile app reads from the local database only. Sync is a background transport you trigger when the API is available.</Text>
        </View>

        <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.muted }]}>API base URL</Text>
          <TextInput
            value={apiUrl}
            onChangeText={setApiUrl}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="http://192.168.1.10:3000"
            placeholderTextColor={colors.muted}
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
          />
          <Text style={[styles.helper, { color: colors.muted }]}>Use an explicit host for real devices. `localhost` only works reliably on simulators.</Text>
          <Pressable
            onPress={() => {
              void syncNow();
            }}
            disabled={isSyncing}
            style={({ pressed }) => [
              styles.syncButton,
              {
                backgroundColor: isSyncing
                  ? colors.surfaceAlt
                  : pressed
                    ? colors.accent
                    : colors.tint,
              },
            ]}
          >
            <Text style={[styles.syncButtonText, { color: isSyncing ? colors.muted : colors.surface }]}>
              {isSyncing ? 'Syncing…' : 'Run Sync Now'}
            </Text>
          </Pressable>
          {syncError ? (
            <Text style={[styles.errorText, { color: colors.danger }]}>{syncError}</Text>
          ) : (
            <Text style={[styles.helper, { color: colors.success }]}>Last sync: {formatRelativeSync(lastSyncedAt)}</Text>
          )}
        </View>

        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.muted }]}>Pending</Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>{dirtyCount}</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.muted }]}>Stored</Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>{entries.length}</Text>
          </View>
        </View>

        <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.muted }]}>Workflow</Text>
          <View style={styles.ruleList}>
            <Text style={[styles.rule, { color: colors.text }]}>1. Save locally first.</Text>
            <Text style={[styles.rule, { color: colors.text }]}>2. Entries stay marked dirty until push succeeds.</Text>
            <Text style={[styles.rule, { color: colors.text }]}>3. Pull applies last-write-wins using `updatedAt`.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 18,
  },
  headerBlock: {
    marginTop: 8,
    gap: 8,
  },
  eyebrow: {
    fontFamily: Fonts.rounded,
    fontSize: 13,
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 38,
    lineHeight: 44,
  },
  copy: {
    fontFamily: Fonts.body,
    fontSize: 16,
    lineHeight: 24,
  },
  panel: {
    borderRadius: 26,
    borderWidth: 1,
    padding: 18,
    gap: 14,
  },
  label: {
    fontFamily: Fonts.rounded,
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontFamily: Fonts.body,
    fontSize: 16,
    lineHeight: 20,
  },
  helper: {
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  syncButton: {
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  syncButtonText: {
    fontFamily: Fonts.rounded,
    fontSize: 15,
    lineHeight: 18,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  errorText: {
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    gap: 8,
  },
  metricValue: {
    fontFamily: Fonts.display,
    fontSize: 30,
    lineHeight: 34,
  },
  ruleList: {
    gap: 10,
  },
  rule: {
    fontFamily: Fonts.body,
    fontSize: 15,
    lineHeight: 22,
  },
});
