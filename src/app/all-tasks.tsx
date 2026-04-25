import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
const List: any = FlashList;
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { useTasks } from '../hooks/useTasks';
import { typography, radius, spacing } from '../constants/theme';
import { TaskCard } from '../components/TaskCard';
import { EmptyState } from '../components/EmptyState';
import { ArrowLeft, Filter } from 'lucide-react-native';
import { Task } from '../types';

export default function AllTasksScreen() {
  const { theme } = useTheme();
  const { tasks, completeTask, removeTask, fetchTasks } = useTasks();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );

  const pendingTasks = useMemo(() => tasks.filter(t => t.status !== 'completed'), [tasks]);
  const completedTasks = useMemo(() => tasks.filter(t => t.status === 'completed'), [tasks]);

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
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.textPrimary }]}>All Tasks</Text>
          <View style={{ width: 24 }} /> {/* Spacer */}
        </View>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {tasks.length} total tasks
        </Text>
      </View>

      <View style={styles.listContainer}>
        {tasks.length === 0 ? (
          <EmptyState message="No tasks created yet." />
        ) : (
          <List
            data={pendingTasks}
            renderItem={renderItem}
            estimatedItemSize={120}
            contentContainerStyle={{ ...styles.listContent, paddingBottom: insets.bottom + 40 }}
            ListHeaderComponent={
               <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Pending Tasks</Text>
            }
            ListFooterComponent={
              completedTasks.length > 0 ? (
                <>
                  <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginTop: spacing.xl }]}>Completed Tasks</Text>
                  {completedTasks.map(t => (
                    <View key={t.id.toString()}>
                      {renderItem({ item: t })}
                    </View>
                  ))}
                </>
              ) : null
            }
            ListEmptyComponent={<EmptyState message="No pending tasks!" />}
          />
        )}
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  backBtn: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  title: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
  },
  subtitle: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    marginBottom: spacing.md,
  },
});
