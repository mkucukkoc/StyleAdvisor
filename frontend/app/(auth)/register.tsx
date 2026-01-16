// ============================================================
// StyleAdvisor AI - Register Screen
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

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const login = useAuthStore((state) => state.login);
  const showToast = useUIStore((state) => state.showToast);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = t('auth.register.passwordMismatch');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authApi.register(name, email, password);
      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        analytics.track('register_success');
        showToast({ type: 'success', message: t('auth.register.success') });
        router.replace('/(auth)/terms-gate');
      }
    } catch (error: any) {
      showToast({ type: 'error', message: error.message || 'Registration failed' });
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
    termsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: theme.spacing.lg,
    },
    termsText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    termsLink: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.primary,
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
          <Text style={styles.title}>{t('auth.register.title')}</Text>
          <Text style={styles.subtitle}>{t('auth.register.subtitle')}</Text>
        </View>

        <View style={styles.form}>
          <Input
            label={t('auth.register.nameLabel')}
            placeholder={t('auth.register.namePlaceholder')}
            value={name}
            onChangeText={setName}
            leftIcon="person-outline"
            error={errors.name}
          />
          <Input
            label={t('auth.register.emailLabel')}
            placeholder={t('auth.register.emailPlaceholder')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
            error={errors.email}
          />
          <Input
            label={t('auth.register.passwordLabel')}
            placeholder={t('auth.register.passwordPlaceholder')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon="lock-closed-outline"
            error={errors.password}
          />
          <Input
            label={t('auth.register.confirmPasswordLabel')}
            placeholder={t('auth.register.confirmPasswordPlaceholder')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            leftIcon="lock-closed-outline"
            error={errors.confirmPassword}
          />

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>{t('auth.register.termsAgreement')} </Text>
            <TouchableOpacity>
              <Text style={styles.termsLink}>{t('auth.register.termsLink')}</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}> {t('common.and')} </Text>
            <TouchableOpacity>
              <Text style={styles.termsLink}>{t('auth.register.privacyLink')}</Text>
            </TouchableOpacity>
          </View>

          <Button
            title={t('auth.register.registerButton')}
            onPress={handleRegister}
            loading={loading}
            fullWidth
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('auth.register.haveAccount')} </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.footerLink}>{t('auth.register.signIn')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
