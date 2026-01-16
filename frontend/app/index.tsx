// ============================================================
// StyleAdvisor AI - Splash/Entry Screen
// ============================================================

import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../src/stores';
import { colors } from '../src/theme/tokens';
import { analytics } from '../src/services';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, isOnboarded, isLoading } = useAuthStore();

  useEffect(() => {
    analytics.track('app_open');

    // Wait for auth state to be rehydrated
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.replace('/(auth)/welcome');
      } else if (!isOnboarded) {
        router.replace('/(onboarding)/profile-setup');
      } else {
        router.replace('/(tabs)/home');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isOnboarded, isLoading]);

  return (
    <LinearGradient
      colors={[colors.dark.background, '#1a0a2e']}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <View style={styles.iconWrapper}>
          <Ionicons name="sparkles" size={48} color={colors.primary} />
        </View>
      </View>
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.loader}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    position: 'absolute',
    bottom: 100,
  },
});
