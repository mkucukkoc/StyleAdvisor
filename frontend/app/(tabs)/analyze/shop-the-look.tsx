// ============================================================
// StyleAdvisor AI - Shop The Look Screen
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';
import { Button, Chip, PremiumLockOverlay } from '../../../src/components';
import { mockProducts } from '../../../src/services/api/mockData';
import { useSubscriptionStore } from '../../../src/stores';
import { analytics } from '../../../src/services';

export default function ShopTheLookScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isPremium = useSubscriptionStore((state) => state.status.isPremium);

  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Tops', 'Bottoms', 'Shoes', 'Outerwear'];

  const filteredProducts = selectedCategory === 'all'
    ? mockProducts
    : mockProducts.filter((p) => p.category === selectedCategory);

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
    filters: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    filtersScroll: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    productCard: {
      width: '47%',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      position: 'relative',
    },
    productImage: {
      width: '100%',
      aspectRatio: 1,
      backgroundColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    productInfo: {
      padding: theme.spacing.md,
    },
    productBrand: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textTertiary,
      marginBottom: theme.spacing.xs,
    },
    productName: {
      fontSize: theme.fontSize.sm,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    productPrice: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
    },
    originalPrice: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textTertiary,
      textDecorationLine: 'line-through',
      marginLeft: theme.spacing.sm,
    },
    lockedMessage: {
      textAlign: 'center',
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{t('analyze.shopTheLook.title')}</Text>
          <Text style={styles.subtitle}>{t('analyze.shopTheLook.subtitle')}</Text>
        </View>
      </View>

      <View style={styles.filters}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat === 'all' ? 'All' : cat}
              selected={selectedCategory === cat}
              onPress={() => setSelectedCategory(cat)}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {filteredProducts.map((product, index) => {
            const isLocked = !isPremium && index >= 10;
            return (
              <TouchableOpacity
                key={product.id}
                style={styles.productCard}
                onPress={() => {
                  if (!isLocked) {
                    analytics.track('product_click', { product_id: product.id });
                    router.push({
                      pathname: '/(tabs)/analyze/product-detail',
                      params: { id: product.id },
                    });
                  }
                }}
                disabled={isLocked}
              >
                <View style={styles.productImage}>
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                      backgroundColor: product.colors[0] || theme.colors.primary,
                    }}
                  />
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productBrand}>{product.brand}</Text>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.productPrice}>${product.price}</Text>
                    {product.originalPrice && (
                      <Text style={styles.originalPrice}>${product.originalPrice}</Text>
                    )}
                  </View>
                </View>
                {isLocked && <PremiumLockOverlay compact />}
              </TouchableOpacity>
            );
          })}
        </View>

        {!isPremium && filteredProducts.length > 10 && (
          <Text style={styles.lockedMessage}>
            {t('analyze.shopTheLook.lockedMessage')}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
