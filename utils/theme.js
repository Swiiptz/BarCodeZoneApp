// utils/theme.js
import { Platform } from 'react-native';

export const colors = {
  bg: '#ffffff',
  text: '#0f172a',
  muted: '#6b7280',
  primary: '#1d4ed8',
  card: '#ffffff',
  border: '#e5e7eb',
  dark: '#111827',
};

export const fonts = {
  heading: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
  body: Platform.select({ ios: 'System', android: 'sans-serif' }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace' }),
};

export const text = {
  h1: { fontFamily: fonts.heading, fontSize: 22, color: colors.text, fontWeight: '700' },
  h2: { fontFamily: fonts.heading, fontSize: 18, color: colors.text, fontWeight: '700' },
  body: { fontFamily: fonts.body, fontSize: 15, color: colors.text },
  label: { fontFamily: fonts.heading, fontSize: 13, color: colors.muted, fontWeight: '700' },
  hint: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
};

export const card = {
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 12,
  borderWidth: 1,
  borderColor: '#e5e7eb',
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  elevation: 1,
};
