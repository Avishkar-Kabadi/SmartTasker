import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useInsights } from '../../hooks/useInsights';
import { typography, radius, spacing } from '../../constants/theme';
import { InsightCard } from '../../components/InsightCard';
import { CheckSquare, Flame, ListTodo } from 'lucide-react-native';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function InsightsTab() {
  const { theme } = useTheme();
  const { insights, loading, fetchInsights } = useInsights();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const navigate = useNavigation()
  useFocusEffect(
    useCallback(() => {
      fetchInsights();
    }, [fetchInsights])
  );

  const barData = useMemo(() => {
    if (!insights) return [];
    return insights.weeklyData.map(d => ({
      value: d.count,
      label: d.day.split('-')[2], // get day of month
      frontColor: theme.primary,
    }));
  }, [insights, theme.primary]);

  const pieData = useMemo(() => {
    if (!insights) return [];
    return insights.categoryData.map(d => ({
      value: d.count,
      color: d.color,
      text: d.category,
    }));
  }, [insights]);

  if (loading || !insights) {
    return <View style={[styles.container, { backgroundColor: theme.background }]} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]} edges={['right', 'left']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Productivity Insights</Text>


        <View style={styles.statsRow}>
          <Pressable onPress={() => router.push('/all-tasks' as any)}>
            <InsightCard
              title="Total Created"
              value={insights.totalTasks}
              icon={ListTodo}
              color={theme.info}
            />
          </Pressable>

          <InsightCard
            title="Completed"
            value={insights.completedThisWeek}
            icon={CheckSquare}
            color={theme.success}
          />
          <InsightCard
            title="Day Streak"
            value={insights.currentStreak}
            icon={Flame}
            color={theme.warning}
          />
        </View>

        <View style={[styles.chartContainer, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
          <Text style={[styles.chartTitle, { color: theme.textPrimary }]}>Completions This Week</Text>
          {barData.length > 0 ? (
            <BarChart
              data={barData}
              barWidth={22}
              spacing={24}
              roundedTop
              roundedBottom
              hideRules
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: theme.textMuted }}
              noOfSections={3}
              maxValue={Math.max(...barData.map(d => d.value), 5)}
              xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
              isAnimated
            />
          ) : (
            <Text style={{ color: theme.textMuted, textAlign: 'center', marginVertical: 20 }}>No data yet.</Text>
          )}
        </View>

        <View style={[styles.chartContainer, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
          <Text style={[styles.chartTitle, { color: theme.textPrimary }]}>Category Distribution</Text>
          <View style={styles.pieContainer}>
            {pieData.length > 0 ? (
              <PieChart
                data={pieData}
                donut
                radius={80}
                innerRadius={60}
                showText
                textColor="white"
                textSize={12}
                centerLabelComponent={() => (
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 22, color: theme.textPrimary, fontWeight: 'bold' }}>
                      {pieData.reduce((acc, curr) => acc + curr.value, 0)}
                    </Text>
                    <Text style={{ fontSize: 10, color: theme.textSecondary }}>Tasks</Text>
                  </View>
                )}
              />
            ) : (
              <Text style={{ color: theme.textMuted, textAlign: 'center', marginVertical: 20 }}>No data yet.</Text>
            )}

            <View style={styles.legendContainer}>
              {pieData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                  <Text style={[styles.legendText, { color: theme.textSecondary }]}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: 100,
  },
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  chartContainer: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  chartTitle: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    marginBottom: spacing.lg,
  },
  pieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  legendContainer: {
    justifyContent: 'center',
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: typography.sm,
  }
});
