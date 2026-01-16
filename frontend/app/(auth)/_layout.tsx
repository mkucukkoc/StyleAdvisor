// ============================================================
// StyleAdvisor AI - Auth Stack Layout
// ============================================================

import { Stack } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';

export default function AuthLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="terms-gate" />
    </Stack>
  );
}
