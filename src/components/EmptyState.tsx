import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { typography, spacing } from '../constants/theme';
import { CheckCircle } from 'lucide-react-native';

interface Props {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<Props> = ({ 
  title = "All caught up!", 
  message = "You have no pending tasks. Enjoy your day or add something new.",
  icon
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {icon || <CheckCircle size={64} color={theme.success} opacity={0.5} />}
      <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: 60,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.base,
    textAlign: 'center',
    lineHeight: typography.normal * typography.base,
  }
});
