// ============================================================
// StyleAdvisor AI - Improvements Checklist Screen
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';
import { useAnalysisStore } from '../../../src/stores';
import { Improvement } from '../../../src/types';

export default function ImprovementsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const currentResult = useAnalysisStore((state) => state.currentResult);

  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const toggleComplete = (id: string) => {
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return theme.colors.error;
      case 'medium': return theme.colors.warning;
      default: return theme.colors.success;
    }
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
    improvementCard: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    checkboxChecked: {
      backgroundColor: theme.colors.success,
      borderColor: theme.colors.success,
    },
    improvementContent: {
      flex: 1,
    },
    improvementHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    priorityBadge: {
      paddingVertical: 2,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing.sm,
    },
    priorityText: {
      fontSize: theme.fontSize.xs,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.white,
    },
    improvementTitle: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.text,
      flex: 1,
    },
    improvementDescription: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    completedText: {
      textDecorationLine: 'line-through',
      opacity: 0.6,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{t('analyze.improvements.title')}</Text>
          <Text style={styles.subtitle}>{t('analyze.improvements.subtitle')}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentResult?.improvements.map((improvement) => {
          const isCompleted = completedIds.includes(improvement.id);
          return (
            <TouchableOpacity
              key={improvement.id}
              style={styles.improvementCard}
              onPress={() => toggleComplete(improvement.id)}
            >
              <View style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
                {isCompleted && (
                  <Ionicons name="checkmark" size={16} color={theme.colors.white} />
                )}
              </View>
              <View style={styles.improvementContent}>
                <View style={styles.improvementHeader}>
                  <View
                    style={[
                      styles.priorityBadge,
                      { backgroundColor: getPriorityColor(improvement.priority) },
                    ]}
                  >
                    <Text style={styles.priorityText}>
                      {t(`analyze.improvements.priority.${improvement.priority}`)}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.improvementTitle,
                      isCompleted && styles.completedText,
                    ]}
                    numberOfLines={1}
                  >
                    {improvement.title}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.improvementDescription,
                    isCompleted && styles.completedText,
                  ]}
                >
                  {improvement.description}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
