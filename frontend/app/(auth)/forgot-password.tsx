// ============================================================
// StyleAdvisor AI - Forgot Password Screen
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button, Input } from '../../src/components';
import { useUIStore } from '../../src/stores';
import { authApi } from '../../src/services/api';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const showToast = useUIStore((state) => state.showToast);

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendReset = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showToast({ type: 'error', message: 'Please enter a valid email' });
      return;
    }

    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
      showToast({ type: 'success', message: t('auth.forgotPassword.success') });
    } catch (error: any) {
      showToast({ type: 'error', message: error.message || 'Failed to send reset link' });
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: insets.top + theme.spacing.xl,
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
    sentContainer: {
      alignItems: 'center',
      paddingVertical: theme.spacing['2xl'],
    },
    sentIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.successLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    },
    sentText: {
      fontSize: theme.fontSize.lg,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    sentSubtext: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  if (sent) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.sentContainer}>
          <View style={styles.sentIcon}>
            <Ionicons name="mail-outline" size={36} color={theme.colors.success} />
          </View>
          <Text style={styles.sentText}>Check your email</Text>
          <Text style={styles.sentSubtext}>We've sent a password reset link to {email}</Text>
        </View>
        <Button
          title={t('auth.forgotPassword.backToLogin')}
          onPress={() => router.push('/(auth)/login')}
          variant="outline"
          fullWidth
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>{t('auth.forgotPassword.title')}</Text>
        <Text style={styles.subtitle}>{t('auth.forgotPassword.subtitle')}</Text>
      </View>

      <Input
        label={t('auth.forgotPassword.emailLabel')}
        placeholder={t('auth.forgotPassword.emailPlaceholder')}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon="mail-outline"
      />

      <Button
        title={t('auth.forgotPassword.sendButton')}
        onPress={handleSendReset}
        loading={loading}
        fullWidth
        style={{ marginTop: theme.spacing.lg }}
      />
    </KeyboardAvoidingView>
  );
}
