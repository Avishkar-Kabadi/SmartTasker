import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
const List: any = FlashList;
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useTasks } from '../../hooks/useTasks';
import { useProfile } from '../../hooks/useProfile';
import { typography, radius, spacing } from '../../constants/theme';
import { TaskCard } from '../../components/TaskCard';
import { EmptyState } from '../../components/EmptyState';
import { format } from 'date-fns';
import { Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Task } from '../../types';

export default function HomeTab() {
  const { theme } = useTheme();
  const { tasks, completeTask, removeTask, fetchTasks } = useTasks();
  const { profile } = useProfile();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );

  const todayStr = new Date().toISOString().split('T')[0];
  
  const todayTasks = useMemo(() => {
    return tasks.filter(t => t.due_date === todayStr);
  }, [tasks, todayStr]);

  const upcomingTasks = useMemo(() => {
    return tasks.filter(t => t.due_date !== todayStr && t.due_date !== null && new Date(t.due_date) > new Date(todayStr));
  }, [tasks, todayStr]);

  const completedTodayCount = todayTasks.filter(t => t.status === 'completed').length;
  const pendingTodayCount = todayTasks.length - completedTodayCount;

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const subGreeting = useMemo(() => {
    if (!profile) return '';
    const today = new Date();
    if (profile.dob) {
      const parts = profile.dob.split('-');
      if (today.getMonth() + 1 === parseInt(parts[1]) && today.getDate() === parseInt(parts[2])) {
        return '🎉 Happy Birthday! Have a wonderful day!';
      }
    }
    if (profile.occupation === 'Student') return '📚 Stay focused on your studies today!';
    if (profile.occupation === 'Working' && profile.role) return `💼 Let's crush those ${profile.role} goals!`;
    return '🚀 Let\'s get things done today!';
  }, [profile]);

  const renderItem = ({ item }: { item: Task }) => (
    <TaskCard
      task={item}
      onComplete={completeTask}
      onDelete={removeTask}
      onPress={(t) => {}}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={[styles.greeting, { color: theme.textSecondary }]}>
          {greeting}, {profile?.name || 'there'} 👋
        </Text>
        <Text style={[styles.date, { color: theme.textPrimary }]}>
          {format(new Date(), 'EEEE, MMMM d')}
        </Text>
        {subGreeting ? (
          <Text style={[styles.subGreeting, { color: theme.primary }]}>{subGreeting}</Text>
        ) : null}
        <View style={styles.statsRow}>
          <View style={[styles.statPill, { backgroundColor: theme.surfaceElevated }]}>
            <Text style={[styles.statText, { color: theme.textPrimary }]}>{todayTasks.length} tasks today</Text>
          </View>
          <View style={[styles.statPill, { backgroundColor: theme.success + '20' }]}>
            <Text style={[styles.statText, { color: theme.success }]}>{completedTodayCount} completed</Text>
          </View>
          <View style={[styles.statPill, { backgroundColor: theme.warning + '20' }]}>
            <Text style={[styles.statText, { color: theme.warning }]}>{pendingTodayCount} pending</Text>
          </View>
        </View>
      </View>

      <View style={styles.listContainer}>
        {tasks.length === 0 ? (
          <EmptyState />
        ) : (
          <List
            data={todayTasks.length > 0 ? todayTasks : upcomingTasks}
            renderItem={renderItem}
            estimatedItemSize={120}
            contentContainerStyle={{ ...styles.listContent, paddingBottom: insets.bottom + 100 }}
            ListHeaderComponent={
              todayTasks.length === 0 && upcomingTasks.length > 0 ? (
                 <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Upcoming Tasks</Text>
              ) : null
            }
            ListEmptyComponent={<EmptyState message="No tasks due today!" />}
          />
        )}
      </View>

      <TouchableOpacity 
        style={[styles.fabContainer, { bottom: insets.bottom + spacing.xl }]}
        onPress={() => router.push('/(tabs)/add' as any)}
      >
        <LinearGradient
          colors={[theme.gradientStart, theme.gradientEnd]}
          style={styles.fab}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Plus size={24} color={theme.textOnPrimary} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  greeting: {
    fontSize: typography.md,
    fontWeight: typography.medium,
    marginBottom: 4,
  },
  date: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    marginBottom: spacing.xs,
  },
  subGreeting: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    marginBottom: spacing.md,
    opacity: 0.9,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  statPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  statText: {
    fontSize: typography.xs,
    fontWeight: typography.semibold,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  fabContainer: {
    position: 'absolute',
    right: spacing.xl,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
