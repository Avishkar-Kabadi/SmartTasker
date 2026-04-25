import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { typography, radius, spacing } from '../constants/theme';
import { LucideIcon } from 'lucide-react-native';

interface InsightCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({ title, value, icon: Icon, color }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.primary;

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
        <Icon color={iconColor} size={20} />
      </View>
      <Text style={[styles.value, { color: theme.textPrimary }]}>{value}</Text>
      <Text style={[styles.title, { color: theme.textSecondary }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  value: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    marginBottom: 2,
  },
  title: {
    fontSize: typography.xs,
    fontWeight: typography.medium,
    textAlign: 'center',
  }
});
