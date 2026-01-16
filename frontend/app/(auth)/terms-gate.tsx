// ============================================================
// StyleAdvisor AI - Terms & Privacy Gate Screen
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button } from '../../src/components';
import { useAuthStore, useUIStore } from '../../src/stores';

export default function TermsGateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const setAcceptedTerms = useAuthStore((state) => state.setAcceptedTerms);
  const showToast = useUIStore((state) => state.showToast);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleContinue = () => {
    if (!termsAccepted || !privacyAccepted) {
      showToast({ type: 'warning', message: t('auth.termsGate.mustAccept') });
      return;
    }
    setAcceptedTerms(true);
    router.replace('/(onboarding)/profile-setup');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: insets.top + theme.spacing.xl,
      paddingBottom: insets.bottom + theme.spacing.lg,
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
    content: {
      flex: 1,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    checkboxChecked: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    checkboxText: {
      flex: 1,
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
    },
    viewLink: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.primary,
      fontWeight: theme.fontWeight.medium,
    },
  });

  const CheckboxRow = ({
    checked,
    onToggle,
    label,
  }: {
    checked: boolean;
    onToggle: () => void;
    label: string;
  }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onToggle}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Ionicons name="checkmark" size={16} color={theme.colors.white} />}
      </View>
      <Text style={styles.checkboxText}>{label}</Text>
      <Text style={styles.viewLink}>View</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('auth.termsGate.title')}</Text>
        <Text style={styles.subtitle}>{t('auth.termsGate.subtitle')}</Text>
      </View>

      <View style={styles.content}>
        <CheckboxRow
          checked={termsAccepted}
          onToggle={() => setTermsAccepted(!termsAccepted)}
          label={t('auth.termsGate.acceptTerms')}
        />
        <CheckboxRow
          checked={privacyAccepted}
          onToggle={() => setPrivacyAccepted(!privacyAccepted)}
          label={t('auth.termsGate.acceptPrivacy')}
        />
      </View>

      <Button
        title={t('auth.termsGate.continueButton')}
        onPress={handleContinue}
        disabled={!termsAccepted || !privacyAccepted}
        fullWidth
      />
    </View>
  );
}
