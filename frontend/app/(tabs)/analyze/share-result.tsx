// ============================================================
// StyleAdvisor AI - Share Result Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share as RNShare } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';
import { Button, ScoreRing } from '../../../src/components';
import { useAnalysisStore, useUIStore } from '../../../src/stores';
import { analytics } from '../../../src/services';

export default function ShareResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const currentResult = useAnalysisStore((state) => state.currentResult);
  const showToast = useUIStore((state) => state.showToast);

  const handleShare = async () => {
    try {
      await RNShare.share({
        message: `Check out my StyleAdvisor score: ${currentResult?.overallScore}%! Get personalized fashion advice with StyleAdvisor AI.`,
      });
      analytics.track('share_result');
    } catch (error) {
      showToast({ type: 'error', message: 'Failed to share' });
    }
  };

  const shareOptions = [
    { id: 'instagram', icon: 'logo-instagram', label: t('analyze.share.platforms.instagram') },
    { id: 'twitter', icon: 'logo-twitter', label: t('analyze.share.platforms.twitter') },
    { id: 'facebook', icon: 'logo-facebook', label: t('analyze.share.platforms.facebook') },
    { id: 'copy', icon: 'copy-outline', label: t('analyze.share.platforms.copy') },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: insets.top + theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    backButton: {
      marginRight: theme.spacing.md,
    },
    headerContent: {
      flex: 1,
    },
    title: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
      alignItems: 'center',
    },
    shareCard: {
      width: '100%',
      borderRadius: theme.borderRadius['2xl'],
      overflow: 'hidden',
      marginBottom: theme.spacing.xl,
    },
    shareCardGradient: {
      padding: theme.spacing.xl,
      alignItems: 'center',
    },
    shareCardTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.white,
      marginBottom: theme.spacing.lg,
    },
    shareCardSubtitle: {
      fontSize: theme.fontSize.sm,
      color: 'rgba(255, 255, 255, 0.8)',
      marginTop: theme.spacing.md,
    },
    shareOptionsContainer: {
      width: '100%',
    },
    shareOptionsTitle: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    shareOptionsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    shareOption: {
      alignItems: 'center',
      width: '22%',
    },
    shareOptionIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
    },
    shareOptionLabel: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textSecondary,
    },
    footer: {
      padding: theme.spacing.lg,
      paddingBottom: insets.bottom + theme.spacing.lg,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{t('analyze.share.title')}</Text>
          <Text style={styles.subtitle}>{t('analyze.share.subtitle')}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Share Card Preview */}
        <View style={styles.shareCard}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.shareCardGradient}
          >
            <Text style={styles.shareCardTitle}>{t('analyze.share.cardTitle')}</Text>
            <ScoreRing
              score={currentResult?.overallScore || 0}
              size={120}
            />
            <Text style={styles.shareCardSubtitle}>StyleAdvisor AI</Text>
          </LinearGradient>
        </View>

        {/* Share Options */}
        <View style={styles.shareOptionsContainer}>
          <View style={styles.shareOptionsGrid}>
            {shareOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.shareOption}
                onPress={handleShare}
              >
                <View style={styles.shareOptionIcon}>
                  <Ionicons name={option.icon as any} size={24} color={theme.colors.text} />
                </View>
                <Text style={styles.shareOptionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title={t('analyze.share.shareButton')}
          onPress={handleShare}
          icon="share-outline"
          fullWidth
        />
      </View>
    </View>
  );
}
