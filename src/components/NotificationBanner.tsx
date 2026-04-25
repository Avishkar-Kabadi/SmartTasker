import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { typography, radius, spacing } from '../constants/theme';
import { Bell } from 'lucide-react-native';

interface Props {
  message: string;
}

export const NotificationBanner: React.FC<Props> = ({ message }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.primary + '15', borderColor: theme.primary + '30' }]}>
      <Bell size={16} color={theme.primary} />
      <Text style={[styles.text, { color: theme.textPrimary }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  text: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    flex: 1,
  }
});
