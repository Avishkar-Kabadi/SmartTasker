import { ThemeColors } from '../types';

export const darkTheme: ThemeColors = {
  // Backgrounds
  background:       '#0A0A14',
  surface:          '#12121F',
  surfaceElevated:  '#1A1A2E',
  surfaceBorder:    '#2A2A4A',

  // Primary — Electric Indigo
  primary:          '#6C63FF',
  primaryLight:     '#8B85FF',
  primaryDark:      '#4A43CC',
  primaryGlow:      'rgba(108, 99, 255, 0.25)',

  // Accent — Violet
  accent:           '#9D4EDD',
  accentLight:      '#B576F0',
  accentGlow:       'rgba(157, 78, 221, 0.20)',

  // Semantic Colors
  success:          '#4ADE80',
  warning:          '#FACC15',
  danger:           '#F87171',
  info:             '#60A5FA',

  // Text
  textPrimary:      '#F0F0FF',
  textSecondary:    '#9898C0',
  textMuted:        '#5A5A80',
  textOnPrimary:    '#FFFFFF',

  // Special
  gradientStart:    '#6C63FF',
  gradientEnd:      '#9D4EDD',
  tabBarBg:         '#0D0D1A',
  statusBar:        'dark',
};

export const lightTheme: ThemeColors = {
  // Backgrounds
  background:       '#F4F4FF',
  surface:          '#FFFFFF',
  surfaceElevated:  '#EEF0FF',
  surfaceBorder:    '#D8D8F0',

  // Primary — Indigo
  primary:          '#5B54E8',
  primaryLight:     '#7B75F0',
  primaryDark:      '#3D37C0',
  primaryGlow:      'rgba(91, 84, 232, 0.18)',

  // Accent — Purple
  accent:           '#8B3FCC',
  accentLight:      '#A660E0',
  accentGlow:       'rgba(139, 63, 204, 0.15)',

  // Semantic
  success:          '#16A34A',
  warning:          '#D97706',
  danger:           '#DC2626',
  info:             '#2563EB',

  // Text
  textPrimary:      '#0D0D2B',
  textSecondary:    '#4A4A7A',
  textMuted:        '#9898B8',
  textOnPrimary:    '#FFFFFF',

  // Special
  gradientStart:    '#5B54E8',
  gradientEnd:      '#8B3FCC',
  tabBarBg:         '#FFFFFF',
  statusBar:        'light',
};

export const typography = {
  // Font sizes
  xs:   11,
  sm:   13,
  base: 15,
  md:   17,
  lg:   20,
  xl:   24,
  xxl:  30,
  xxxl: 38,

  // Font weights
  regular:    '400' as const,
  medium:     '500' as const,
  semibold:   '600' as const,
  bold:       '700' as const,
  extrabold:  '800' as const,

  // Line heights
  tight:   1.2,
  normal:  1.5,
  relaxed: 1.75,
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 };
export const radius =  { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 };
