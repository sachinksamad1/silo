import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1f1b18',
    background: '#f5efe6',
    surface: '#fffaf2',
    surfaceAlt: '#ece3d7',
    tint: '#90633d',
    accent: '#325a49',
    accentSoft: '#d8e4dd',
    border: '#d9c9b8',
    icon: '#6f6257',
    muted: '#7b6b5f',
    tabIconDefault: '#8d7f74',
    tabIconSelected: '#90633d',
    success: '#2f6f56',
    warning: '#9d6c2f',
    danger: '#8c3d35',
    shadow: 'rgba(43, 32, 24, 0.12)',
  },
  dark: {
    text: '#f3ede6',
    background: '#161311',
    surface: '#221c18',
    surfaceAlt: '#2b241f',
    tint: '#d5a26f',
    accent: '#7fb09a',
    accentSoft: '#2f4339',
    border: '#40362f',
    icon: '#b9afa6',
    muted: '#a5978d',
    tabIconDefault: '#8f8379',
    tabIconSelected: '#d5a26f',
    success: '#81c3a7',
    warning: '#d8b06a',
    danger: '#d38a7e',
    shadow: 'rgba(0, 0, 0, 0.24)',
  },
};

export const Fonts = Platform.select({
  ios: {
    body: 'Avenir Next',
    display: 'Georgia',
    rounded: 'Arial Rounded MT Bold',
    mono: 'Menlo',
  },
  android: {
    body: 'sans-serif-medium',
    display: 'serif',
    rounded: 'sans-serif',
    mono: 'monospace',
  },
  web: {
    body: "'Avenir Next', 'Segoe UI', sans-serif",
    display: "Georgia, 'Times New Roman', serif",
    rounded: "'Trebuchet MS', 'Avenir Next', sans-serif",
    mono: "Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
  },
  default: {
    body: 'sans-serif',
    display: 'serif',
    rounded: 'sans-serif',
    mono: 'monospace',
  },
});
