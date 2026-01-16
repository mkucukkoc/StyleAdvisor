// ============================================================
// StyleAdvisor AI - Prompt Templates Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/theme/ThemeContext';

export default function PromptTemplatesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const templates = [
    { id: 1, title: 'Office Meeting', prompt: 'I need an outfit for an important office meeting' },
    { id: 2, title: 'First Date', prompt: 'What should I wear on a first date at a nice restaurant?' },
    { id: 3, title: 'Weekend Brunch', prompt: 'Casual weekend brunch outfit ideas' },
    { id: 4, title: 'Job Interview', prompt: 'Professional outfit for a job interview' },
    { id: 5, title: 'Wedding Guest', prompt: 'What to wear as a wedding guest' },
    { id: 6, title: 'Vacation Style', prompt: 'Beach vacation outfit ideas' },
  ];

  const handleSelect = (prompt: string) => {
    router.push({
      pathname: '/(tabs)/analyze/text-request',
      params: { prefill: prompt },
    });
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
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    templateCard: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
    },
    templateTitle: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    templatePrompt: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Prompt Templates</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {templates.map((template) => (
          <TouchableOpacity
            key={template.id}
            style={styles.templateCard}
            onPress={() => handleSelect(template.prompt)}
          >
            <Text style={styles.templateTitle}>{template.title}</Text>
            <Text style={styles.templatePrompt}>{template.prompt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
