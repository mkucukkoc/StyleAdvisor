// ============================================================
// StyleAdvisor AI - Result Overview Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';
import { Button, Card, ScoreRing, PremiumLockOverlay } from '../../../src/components';
import { useAnalysisStore, useSubscriptionStore, useFavoritesStore, useUIStore } from '../../../src/stores';
import { analytics } from '../../../src/services';

export default function ResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const currentResult = useAnalysisStore((state) => state.currentResult);
  const isPremium = useSubscriptionStore((state) => state.status.isPremium);
  const showToast = useUIStore((state) => state.showToast);

  React.useEffect(() => {
    analytics.track('result_view');
  }, []);

  if (!currentResult) {
    router.back();
    return null;
  }

  const scoreCategories = [
    { key: 'colorHarmony', data: currentResult.colorHarmony, icon: 'color-palette' },
    { key: 'fitAssessment', data: currentResult.fitAssessment, icon: 'resize' },
    { key: 'styleCoherence', data: currentResult.styleCoherence, icon: 'sparkles' },
    { key: 'occasionMatch', data: currentResult.occasionMatch, icon: 'calendar' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.colors.success;
    if (score >= 60) return '#22C55E';
    if (score >= 40) return theme.colors.warning;
    return theme.colors.error;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: insets.top + theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
    },
    shareButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    scoreSection: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
    },
    overallLabel: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
    },
    categoriesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.xl,
    },
    categoryCard: {
      width: '48%',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      position: 'relative',
      overflow: 'hidden',
    },
    categoryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    categoryIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: theme.colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryScore: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    categoryTitle: {
      fontSize: theme.fontSize.sm,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    categoryDescription: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textSecondary,
      lineHeight: 16,
    },
    actionsSection: {
      gap: theme.spacing.md,
      marginBottom: theme.spacing.xl,
    },
    actionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
    },
    actionIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: theme.colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    actionContent: {
      flex: 1,
    },
    actionTitle: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.text,
    },
    actionSubtitle: {
      fontSize: theme.fontSize.sm,
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(tabs)/analyze')}>
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('analyze.result.title')}</Text>
        <TouchableOpacity style={styles.shareButton} onPress={() => router.push('/(tabs)/analyze/share-result')}>
          <Ionicons name="share-outline" size={22} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overall Score */}
        <View style={styles.scoreSection}>
          <Text style={styles.overallLabel}>{t('analyze.result.overallScore')}</Text>
          <ScoreRing score={currentResult.overallScore} size={140} />
        </View>

        {/* Score Categories */}
        <View style={styles.categoriesGrid}>
          {scoreCategories.map((cat) => (
            <View key={cat.key} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryIcon}>
                  <Ionicons name={cat.icon as any} size={16} color={theme.colors.primary} />
                </View>
                <Text style={[styles.categoryScore, { color: getScoreColor(cat.data.score) }]}>
                  {cat.data.score}
                </Text>
              </View>
              <Text style={styles.categoryTitle}>
                {t(`analyze.result.sections.${cat.key}`)}
              </Text>
              <Text style={styles.categoryDescription} numberOfLines={2}>
                {cat.data.description}
              </Text>
              {cat.data.isPremiumLocked && !isPremium && (
                <PremiumLockOverlay compact />
              )}
            </View>
          ))}
        </View>

        {/* Action Cards */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/analyze/improvements')}
          >
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Ionicons name="bulb" size={22} color={theme.colors.warning} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>{t('analyze.result.improvements')}</Text>
              <Text style={styles.actionSubtitle}>
                {currentResult.improvements.length} suggestions
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/analyze/outfit-suggestions')}
          >
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(124, 58, 237, 0.15)' }]}>
              <Ionicons name="shirt" size={22} color={theme.colors.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>{t('analyze.result.outfitSuggestions')}</Text>
              <Text style={styles.actionSubtitle}>
                {currentResult.outfitSuggestions.length} outfits
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/analyze/shop-the-look')}
          >
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Ionicons name="bag" size={22} color={theme.colors.success} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>{t('analyze.result.shopTheLook')}</Text>
              <Text style={styles.actionSubtitle}>Find similar items</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t('analyze.result.saveToFavorites')}
          onPress={() => {
            showToast({ type: 'success', message: 'Saved to favorites!' });
          }}
          icon="heart-outline"
          fullWidth
        />
      </View>
    </View>
  );
}
