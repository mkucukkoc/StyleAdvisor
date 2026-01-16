// ============================================================
// StyleAdvisor AI - Welcome Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button } from '../../src/components';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingTop: insets.top + 60,
      paddingHorizontal: theme.spacing.lg,
    },
    heroSection: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconContainer: {
      width: 120,
      height: 120,
      borderRadius: 36,
      backgroundColor: 'rgba(124, 58, 237, 0.15)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.xl,
    },
    title: {
      fontSize: theme.fontSize['3xl'],
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.white,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    subtitle: {
      fontSize: theme.fontSize.lg,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 26,
      paddingHorizontal: theme.spacing.md,
    },
    featuresContainer: {
      marginTop: theme.spacing['2xl'],
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    featureIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: 'rgba(124, 58, 237, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    featureText: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
    },
    bottomSection: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: insets.bottom + theme.spacing.lg,
      gap: theme.spacing.md,
    },
  });

  const features = [
    { icon: 'color-palette-outline' as const, text: 'AI Style Analysis' },
    { icon: 'shirt-outline' as const, text: 'Outfit Recommendations' },
    { icon: 'bag-outline' as const, text: 'Smart Shopping' },
  ];

  return (
    <LinearGradient
      colors={[theme.colors.background, '#1a0a2e']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="sparkles" size={56} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>{t('auth.welcome.title')}</Text>
          <Text style={styles.subtitle}>{t('auth.welcome.subtitle')}</Text>

          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons
                    name={feature.icon}
                    size={20}
                    color={theme.colors.primary}
                  />
                </View>
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Button
          title={t('auth.welcome.loginButton')}
          onPress={() => router.push('/(auth)/login')}
          fullWidth
        />
        <Button
          title={t('auth.welcome.registerButton')}
          onPress={() => router.push('/(auth)/register')}
          variant="outline"
          fullWidth
        />
      </View>
    </LinearGradient>
  );
}
