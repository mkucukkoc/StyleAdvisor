// ============================================================
// StyleAdvisor AI - PhotoSourceSelector BottomSheet
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';
import { BottomSheet } from './BottomSheet';

interface PhotoSourceSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectCamera: () => void;
  onSelectGallery: () => void;
}

export const PhotoSourceSelector: React.FC<PhotoSourceSelectorProps> = ({
  visible,
  onClose,
  onSelectCamera,
  onSelectGallery,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const styles = StyleSheet.create({
    container: {
      paddingBottom: theme.spacing.lg,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      marginBottom: theme.spacing.md,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    chevron: {
      marginLeft: theme.spacing.md,
    },
  });

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={t('analyze.photoSource.title')}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => {
            onSelectCamera();
            onClose();
          }}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="camera" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{t('analyze.photoSource.camera')}</Text>
            <Text style={styles.subtitle}>{t('analyze.photoSource.cameraDesc')}</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.textTertiary}
            style={styles.chevron}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => {
            onSelectGallery();
            onClose();
          }}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="images" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{t('analyze.photoSource.gallery')}</Text>
            <Text style={styles.subtitle}>{t('analyze.photoSource.galleryDesc')}</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.textTertiary}
            style={styles.chevron}
          />
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

export default PhotoSourceSelector;
