// ============================================================
// StyleAdvisor AI - Outfit Detail Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';
import { Button, Card } from '../../../src/components';
import { useAnalysisStore, useFavoritesStore, useUIStore } from '../../../src/stores';
import { analytics } from '../../../src/services';

export default function OutfitDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const currentResult = useAnalysisStore((state) => state.currentResult);
  const addOutfit = useFavoritesStore((state) => state.addOutfit);
  const showToast = useUIStore((state) => state.showToast);

  const outfit = currentResult?.outfitSuggestions.find((o) => o.id === id);

  if (!outfit) {
    return null;
  }

  const handleSave = () => {
    addOutfit(outfit);
    analytics.track('outfit_save', { outfit_id: outfit.id });
    showToast({ type: 'success', message: 'Outfit saved to favorites!' });
  };

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
    title: {
      flex: 1,
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    outfitInfo: {
      marginBottom: theme.spacing.xl,
    },
    outfitName: {
      fontSize: theme.fontSize['2xl'],
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    outfitDescription: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
      lineHeight: 24,
    },
    badges: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
    },
    badgeText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    itemCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
    },
    itemColor: {
      width: 48,
      height: 48,
      borderRadius: 12,
      marginRight: theme.spacing.md,
    },
    itemInfo: {
      flex: 1,
    },
    itemName: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.text,
    },
    itemMeta: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    itemPrice: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
    },
    totalSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      marginTop: theme.spacing.md,
    },
    totalLabel: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
    },
    totalPrice: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    footer: {
      padding: theme.spacing.lg,
      paddingBottom: insets.bottom + theme.spacing.lg,
      gap: theme.spacing.sm,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('analyze.outfitDetail.title')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.outfitInfo}>
          <Text style={styles.outfitName}>{outfit.name}</Text>
          <Text style={styles.outfitDescription}>{outfit.description}</Text>
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Ionicons name="calendar-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.badgeText}>{outfit.occasion}</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="sparkles-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.badgeText}>{outfit.style}</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="leaf-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.badgeText}>{outfit.season}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('analyze.outfitDetail.items')}</Text>
        {outfit.items.map((item) => (
          <TouchableOpacity key={item.id} style={styles.itemCard}>
            <View style={[styles.itemColor, { backgroundColor: item.color }]} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemMeta}>{item.brand} · {item.category}</Text>
            </View>
            <Text style={styles.itemPrice}>${item.price}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>{t('analyze.outfitDetail.totalPrice')}</Text>
          <Text style={styles.totalPrice}>${outfit.totalPrice}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t('analyze.outfitDetail.shopAll')}
          onPress={() => router.push('/(tabs)/analyze/shop-the-look')}
          fullWidth
        />
        <Button
          title={t('analyze.outfitDetail.saveOutfit')}
          onPress={handleSave}
          variant="outline"
          icon="heart-outline"
          fullWidth
        />
      </View>
    </View>
  );
}
