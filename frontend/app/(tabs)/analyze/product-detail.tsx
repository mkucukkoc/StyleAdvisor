// ============================================================
// StyleAdvisor AI - Product Detail Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';
import { Button, Chip } from '../../../src/components';
import { mockProducts } from '../../../src/services/api/mockData';
import { useFavoritesStore, useUIStore } from '../../../src/stores';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const addProduct = useFavoritesStore((state) => state.addProduct);
  const isProductFavorite = useFavoritesStore((state) => state.isProductFavorite);
  const showToast = useUIStore((state) => state.showToast);

  const product = mockProducts.find((p) => p.id === id) || mockProducts[0];
  const isFavorite = isProductFavorite(product.id);

  const handleAddToFavorites = () => {
    addProduct(product);
    showToast({ type: 'success', message: 'Added to favorites!' });
  };

  const handleViewOnSite = () => {
    // In production, this would open the affiliate URL
    showToast({ type: 'info', message: 'Opening retailer website...' });
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
    favoriteButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
    },
    imageContainer: {
      aspectRatio: 1,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    productColor: {
      width: 120,
      height: 120,
      borderRadius: 20,
    },
    productInfo: {
      padding: theme.spacing.lg,
    },
    brand: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.primary,
      fontWeight: theme.fontWeight.medium,
      marginBottom: theme.spacing.xs,
    },
    name: {
      fontSize: theme.fontSize['2xl'],
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    price: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    originalPrice: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textTertiary,
      textDecorationLine: 'line-through',
      marginLeft: theme.spacing.sm,
    },
    discount: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.success,
      fontWeight: theme.fontWeight.medium,
      marginLeft: theme.spacing.sm,
    },
    rating: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    ratingText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.text,
      marginLeft: theme.spacing.xs,
    },
    reviewCount: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
    },
    description: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
      lineHeight: 24,
      marginBottom: theme.spacing.lg,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    colorsRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    colorCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    sizesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    disclosure: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textTertiary,
      fontStyle: 'italic',
      marginTop: theme.spacing.lg,
    },
    footer: {
      padding: theme.spacing.lg,
      paddingBottom: insets.bottom + theme.spacing.lg,
      gap: theme.spacing.sm,
    },
  });

  const discountPercent = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton} onPress={handleAddToFavorites}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite ? theme.colors.error : theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <View
            style={[
              styles.productColor,
              { backgroundColor: product.colors[0] || theme.colors.primary },
            ]}
          />
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price}</Text>
            {product.originalPrice && (
              <>
                <Text style={styles.originalPrice}>${product.originalPrice}</Text>
                <Text style={styles.discount}>-{discountPercent}%</Text>
              </>
            )}
          </View>

          {product.rating && (
            <View style={styles.rating}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.ratingText}>{product.rating}</Text>
              <Text style={styles.reviewCount}>({product.reviewCount} reviews)</Text>
            </View>
          )}

          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('analyze.productDetail.colors')}</Text>
            <View style={styles.colorsRow}>
              {product.colors.map((color, index) => (
                <View
                  key={index}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    index === 0 && { borderColor: theme.colors.primary },
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('analyze.productDetail.sizes')}</Text>
            <View style={styles.sizesRow}>
              {product.sizes.map((size) => (
                <Chip key={size} label={size} variant="outline" />
              ))}
            </View>
          </View>

          <Text style={styles.disclosure}>
            {t('analyze.productDetail.affiliateDisclosure')}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t('analyze.productDetail.viewOnSite')}
          onPress={handleViewOnSite}
          icon="open-outline"
          fullWidth
        />
        <Button
          title={t('analyze.productDetail.addToFavorites')}
          onPress={handleAddToFavorites}
          variant="outline"
          icon="heart-outline"
          fullWidth
        />
      </View>
    </View>
  );
}
