import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { JournalProvider } from '@/providers/journal-provider';
import { migrateNativeStorage } from 'storage';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SQLiteProvider databaseName="silo-mobile.db" onInit={migrateNativeStorage}>
        <JournalProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor: colors.background,
                },
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="compose" options={{ presentation: 'modal' }} />
              <Stack.Screen name="entry/[id]" options={{ presentation: 'card' }} />
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </ThemeProvider>
        </JournalProvider>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
