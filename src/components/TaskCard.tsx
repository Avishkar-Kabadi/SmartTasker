import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '../types';
import { useTheme } from '../hooks/useTheme';
import { typography, radius, spacing } from '../constants/theme';
import { CategoryBadge } from './CategoryBadge';
import { PriorityIndicator } from './PriorityIndicator';
import { CheckCircle2, Clock, MoreVertical, Circle } from 'lucide-react-native';
import { formatTimeDisplay } from '../utils/dateHelpers';
import { PRIORITY_COLORS } from '../constants/categories';

interface TaskCardProps {
  task: Task;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onPress: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onDelete, onPress }) => {
  const { theme } = useTheme();
  const isCompleted = task.status === 'completed';

  const handleComplete = () => {
    if (!isCompleted) onComplete(task.id);
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={() => onPress(task)}
      style={[
        styles.card, 
        { 
          backgroundColor: theme.surface,
          borderColor: theme.surfaceBorder,
          borderLeftColor: PRIORITY_COLORS[task.priority],
          opacity: isCompleted ? 0.6 : 1,
        }
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <PriorityIndicator priority={task.priority} />
          <CategoryBadge category={task.category} />
        </View>
        {task.due_time && (
          <View style={styles.timeContainer}>
            <Clock size={14} color={theme.textMuted} />
            <Text style={[styles.timeText, { color: theme.textSecondary }]}>
              {formatTimeDisplay(task.due_time)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text 
          style={[
            styles.title, 
            { color: theme.textPrimary },
            isCompleted && { textDecorationLine: 'line-through', color: theme.textSecondary }
          ]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        {task.description ? (
          <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}
      </View>

      <View style={[styles.footer, { borderTopColor: theme.surfaceBorder }]}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleComplete}>
          {isCompleted ? (
            <CheckCircle2 size={18} color={theme.success} />
          ) : (
            <Circle size={18} color={theme.textMuted} />
          )}
          <Text style={[styles.actionText, { color: isCompleted ? theme.success : theme.textSecondary }]}>
            {isCompleted ? 'Completed' : 'Complete'}
          </Text>
        </TouchableOpacity>

        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => onDelete(task.id)}>
             <Text style={{color: theme.danger, fontSize: typography.xs, fontWeight: typography.medium}}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderLeftWidth: 4,
    marginBottom: spacing.md,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: typography.xs,
    fontWeight: typography.medium,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    marginBottom: 4,
  },
  description: {
    fontSize: typography.sm,
    lineHeight: typography.normal * typography.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBtn: {
    padding: 4,
  }
});
