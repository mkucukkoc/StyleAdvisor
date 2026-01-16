// ============================================================
// StyleAdvisor AI - Outfit Suggestions Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';
import { Button, PremiumLockOverlay } from '../../../src/components';
import { useAnalysisStore, useSubscriptionStore } from '../../../src/stores';

export default function OutfitSuggestionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const currentResult = useAnalysisStore((state) => state.currentResult);
  const isPremium = useSubscriptionStore((state) => state.status.isPremium);

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
      paddingHorizontal: theme.spacing.lg,
    },
    outfitCard: {
      borderRadius: theme.borderRadius.xl,
      marginBottom: theme.spacing.md,
      overflow: 'hidden',
      position: 'relative',
    },
    outfitGradient: {
      padding: theme.spacing.lg,
    },
    outfitBadge: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      alignSelf: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    outfitBadgeText: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.white,
      fontWeight: theme.fontWeight.medium,
    },
    outfitName: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.white,
      marginBottom: theme.spacing.xs,
    },
    outfitDescription: {
      fontSize: theme.fontSize.sm,
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: theme.spacing.md,
    },
    outfitMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    outfitPrice: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.white,
    },
    lockedMessage: {
      textAlign: 'center',
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
    },
  });

  const getOutfitColors = (index: number): [string, string] => {
    const colors: [string, string][] = [
      [theme.colors.primary, theme.colors.primaryDark],
      ['#10B981', '#059669'],
      ['#F59E0B', '#D97706'],
      ['#EC4899', '#DB2777'],
      ['#6366F1', '#4F46E5'],
    ];
    return colors[index % colors.length];
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{t('analyze.outfitSuggestions.title')}</Text>
          <Text style={styles.subtitle}>{t('analyze.outfitSuggestions.subtitle')}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentResult?.outfitSuggestions.map((outfit, index) => {
          const isLocked = !isPremium && index >= 2;
          return (
            <TouchableOpacity
              key={outfit.id}
              style={styles.outfitCard}
              onPress={() => {
                if (!isLocked) {
                  router.push({
                    pathname: '/(tabs)/analyze/outfit-detail',
                    params: { id: outfit.id },
                  });
                }
              }}
              disabled={isLocked}
            >
              <LinearGradient
                colors={getOutfitColors(index)}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.outfitGradient}
              >
                <View style={styles.outfitBadge}>
                  <Text style={styles.outfitBadgeText}>{outfit.occasion}</Text>
                </View>
                <Text style={styles.outfitName}>{outfit.name}</Text>
                <Text style={styles.outfitDescription}>{outfit.description}</Text>
                <View style={styles.outfitMeta}>
                  <Text style={styles.outfitPrice}>
                    ${outfit.totalPrice}
                  </Text>
                  <Button
                    title={t('analyze.outfitSuggestions.viewDetails')}
                    variant="secondary"
                    size="small"
                    onPress={() => {}}
                  />
                </View>
              </LinearGradient>
              {isLocked && <PremiumLockOverlay />}
            </TouchableOpacity>
          );
        })}

        {!isPremium && (
          <Text style={styles.lockedMessage}>
            {t('analyze.outfitSuggestions.lockedMessage')}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
