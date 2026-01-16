// ============================================================
// StyleAdvisor AI - Login Screen
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button, Input } from '../../src/components';
import { useAuthStore, useUIStore } from '../../src/stores';
import { authApi } from '../../src/services/api';
import { analytics } from '../../src/services';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const login = useAuthStore((state) => state.login);
  const setOnboarded = useAuthStore((state) => state.setOnboarded);
  const showToast = useUIStore((state) => state.showToast);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 4) newErrors.password = 'Password too short';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authApi.login(email, password);
      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        setOnboarded(true); // For demo, assume onboarded
        analytics.track('login_success');
        showToast({ type: 'success', message: t('auth.login.success') });
        router.replace('/(tabs)/home');
      }
    } catch (error: any) {
      analytics.track('login_failure');
      showToast({ type: 'error', message: error.message || t('auth.login.invalidCredentials') });
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: insets.top + theme.spacing.xl,
      paddingBottom: insets.bottom + theme.spacing.lg,
    },
    backButton: {
      marginBottom: theme.spacing.xl,
    },
    header: {
      marginBottom: theme.spacing['2xl'],
    },
    title: {
      fontSize: theme.fontSize['3xl'],
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
    },
    form: {
      marginBottom: theme.spacing.lg,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: theme.spacing.lg,
    },
    forgotPasswordText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.primary,
      fontWeight: theme.fontWeight.medium,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: theme.spacing.lg,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border,
    },
    dividerText: {
      paddingHorizontal: theme.spacing.md,
      fontSize: theme.fontSize.sm,
      color: theme.colors.textTertiary,
    },
    socialButtons: {
      gap: theme.spacing.md,
    },
    socialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    socialButtonText: {
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
      fontWeight: theme.fontWeight.medium,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 'auto',
      paddingTop: theme.spacing.lg,
    },
    footerText: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
    },
    footerLink: {
      fontSize: theme.fontSize.md,
      color: theme.colors.primary,
      fontWeight: theme.fontWeight.semibold,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>{t('auth.login.title')}</Text>
          <Text style={styles.subtitle}>{t('auth.login.subtitle')}</Text>
        </View>

        <View style={styles.form}>
          <Input
            label={t('auth.login.emailLabel')}
            placeholder={t('auth.login.emailPlaceholder')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
            error={errors.email}
          />
          <Input
            label={t('auth.login.passwordLabel')}
            placeholder={t('auth.login.passwordPlaceholder')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon="lock-closed-outline"
            error={errors.password}
          />
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => router.push('/(auth)/forgot-password')}
          >
            <Text style={styles.forgotPasswordText}>{t('auth.login.forgotPassword')}</Text>
          </TouchableOpacity>

          <Button
            title={t('auth.login.loginButton')}
            onPress={handleLogin}
            loading={loading}
            fullWidth
          />
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t('auth.login.orContinueWith')}</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-apple" size={20} color={theme.colors.text} />
            <Text style={styles.socialButtonText}>{t('auth.login.apple')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-google" size={20} color={theme.colors.text} />
            <Text style={styles.socialButtonText}>{t('auth.login.google')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('auth.login.noAccount')} </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.footerLink}>{t('auth.login.signUp')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
