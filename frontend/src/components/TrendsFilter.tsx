// ============================================================
// StyleAdvisor AI - Trends Filter BottomSheet Component
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';
import { BottomSheet } from './BottomSheet';
import { Chip } from './Chip';
import { Button } from './Button';

interface TrendsFilterProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: TrendFilters) => void;
  initialFilters?: TrendFilters;
}

export interface TrendFilters {
  categories: string[];
  styles: string[];
  seasons: string[];
}

const defaultFilters: TrendFilters = {
  categories: [],
  styles: [],
  seasons: [],
};

export const TrendsFilter: React.FC<TrendsFilterProps> = ({
  visible,
  onClose,
  onApply,
  initialFilters = defaultFilters,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [filters, setFilters] = useState<TrendFilters>(initialFilters);

  const categories = ['Casual', 'Formal', 'Streetwear', 'Athleisure', 'Vintage'];
  const stylesList = ['Minimalist', 'Bold', 'Classic', 'Trendy', 'Bohemian'];
  const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];

  const toggleFilter = (type: keyof TrendFilters, value: string) => {
    setFilters((prev) => {
      const current = prev[type];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  const clearAll = () => {
    setFilters(defaultFilters);
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const styles = StyleSheet.create({
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    chipsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    footer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginTop: theme.spacing.lg,
    },
    clearButton: {
      flex: 1,
    },
    applyButton: {
      flex: 2,
    },
  });

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={t('trends.filters.title')}
      height={500}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('trends.filters.categories')}</Text>
          <View style={styles.chipsContainer}>
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                selected={filters.categories.includes(cat)}
                onPress={() => toggleFilter('categories', cat)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('trends.filters.styles')}</Text>
          <View style={styles.chipsContainer}>
            {stylesList.map((style) => (
              <Chip
                key={style}
                label={style}
                selected={filters.styles.includes(style)}
                onPress={() => toggleFilter('styles', style)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('trends.filters.seasons')}</Text>
          <View style={styles.chipsContainer}>
            {seasons.map((season) => (
              <Chip
                key={season}
                label={season}
                selected={filters.seasons.includes(season)}
                onPress={() => toggleFilter('seasons', season)}
              />
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title={t('common.clear')}
            onPress={clearAll}
            variant="secondary"
            style={styles.clearButton}
          />
          <Button
            title={t('common.apply')}
            onPress={handleApply}
            style={styles.applyButton}
          />
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

export default TrendsFilter;
