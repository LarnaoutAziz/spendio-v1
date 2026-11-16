import { Platform, StyleSheet } from 'react-native';

// Shadow presets compatible with all platforms
export const getShadow = (elevation: number = 2) => {
  if (Platform.OS === 'web') {
    // Web uses boxShadow
    const shadowMap: Record<number, string> = {
      1: '0px 1px 3px rgba(0, 0, 0, 0.08)',
      2: '0px 2px 6px rgba(0, 0, 0, 0.1)',
      4: '0px 4px 12px rgba(0, 0, 0, 0.12)',
      6: '0px 6px 16px rgba(0, 0, 0, 0.15)',
      8: '0px 8px 24px rgba(0, 0, 0, 0.18)',
    };
    return { boxShadow: shadowMap[elevation] || shadowMap[2] };
  } else {
    // Mobile uses shadowColor, shadowOffset, etc.
    const shadowMap: Record<number, any> = {
      1: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 1,
      },
      2: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      4: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
      },
      6: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
      },
      8: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
        elevation: 8,
      },
    };
    return shadowMap[elevation] || shadowMap[2];
  }
};

// Predefined shadow styles
export const SHADOWS = {
  sm: getShadow(1),
  md: getShadow(2),
  lg: getShadow(4),
  xl: getShadow(6),
  xxl: getShadow(8),
} as const;
