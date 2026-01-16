// ============================================================
// StyleAdvisor AI - Home Tab Stack
// ============================================================

import { Stack } from 'expo-router';
import { useTheme } from '../../../src/theme/ThemeContext';

export default function HomeLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="trends" />
      <Stack.Screen name="prompt-templates" />
    </Stack>
  );
}
