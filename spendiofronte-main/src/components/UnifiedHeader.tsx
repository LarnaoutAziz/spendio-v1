import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../styles/theme';

interface UnifiedHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  style?: any;
}

export const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({ 
  title, 
  subtitle,
  icon,
  style 
}) => {
  return (
    <LinearGradient
      colors={[THEME.COLORS.primary, THEME.COLORS.primaryLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.headerGradient, style]}
    >
      <View style={styles.headerContent}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: THEME.COLORS.white,
    marginBottom: 4,
    fontFamily: THEME.FONT.bold,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.COLORS.white,
    opacity: 0.85,
    fontFamily: THEME.FONT.regular,
  },
  iconContainer: {
    marginLeft: 12,
  },
});
