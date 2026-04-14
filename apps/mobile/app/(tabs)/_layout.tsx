import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 86,
          paddingTop: 10,
          paddingBottom: 18,
        },
        tabBarLabelStyle: {
          fontFamily: Fonts.rounded,
          fontSize: 12,
          letterSpacing: 0.3,
          textTransform: 'uppercase',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="auto-stories" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sync"
        options={{
          title: 'Sync',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="sync" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
