import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useTasks } from '../../hooks/useTasks';
import { typography, radius, spacing } from '../../constants/theme';
import { SmartInput } from '../../components/SmartInput';
import { Category, Priority, Recurrence } from '../../types';
import { CATEGORIES } from '../../constants/categories';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock, ChevronDown } from 'lucide-react-native';

export default function AddTab() {
  const { theme } = useTheme();
  const { addTask } = useTasks();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [input, setInput] = useState('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [dueTime, setDueTime] = useState<Date | null>(null);
  const [category, setCategory] = useState<Category>('General');
  const [priority, setPriority] = useState<Priority>('medium');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState<Recurrence>('none');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleParsed = (parsed: any) => {
    if (parsed.title) setTitle(parsed.title);
    if (parsed.due_date) {
      // Avoid time zone shifts by parsing parts
      const [y, m, d] = parsed.due_date.split('-');
      setDueDate(new Date(y, m - 1, d));
    }
    if (parsed.due_time) {
      const [h, min] = parsed.due_time.split(':');
      const timeDate = new Date();
      timeDate.setHours(parseInt(h), parseInt(min), 0, 0);
      setDueTime(timeDate);
    }
    setCategory(parsed.category);
    setPriority(parsed.priority);
    setIsRecurring(parsed.isRecurring);
    setRecurrence(parsed.recurrence);
  };

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: dueDate || new Date(),
      onChange: (event, selectedDate) => {
        if (selectedDate) setDueDate(selectedDate);
      },
      mode: 'date',
    });
  };

  const showTimePicker = () => {
    DateTimePickerAndroid.open({
      value: dueTime || new Date(),
      onChange: (event, selectedDate) => {
        if (selectedDate) setDueTime(selectedDate);
      },
      mode: 'time',
    });
  };

  const handleSave = async () => {
    const finalTitle = title || input;
    if (!finalTitle.trim()) return; // guard
    
    let dateStr = null;
    if (dueDate) {
      dateStr = `${dueDate.getFullYear()}-${(dueDate.getMonth() + 1).toString().padStart(2, '0')}-${dueDate.getDate().toString().padStart(2, '0')}`;
    }
    
    let timeStr = null;
    if (dueTime) {
      timeStr = `${dueTime.getHours().toString().padStart(2, '0')}:${dueTime.getMinutes().toString().padStart(2, '0')}`;
    }

    await addTask({
      title: finalTitle,
      description: '',
      category,
      priority,
      status: 'pending',
      due_date: dateStr,
      due_time: timeStr,
      is_recurring: isRecurring,
      recurrence,
      tags: [],
    });
    
    // Reset state and go back
    setInput('');
    setTitle('');
    setDueDate(null);
    setDueTime(null);
    router.push('/(tabs)/home' as any);
  };

  const isSaveDisabled = !input.trim() && !title.trim();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]} edges={['right', 'left']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>New Task</Text>
        
        <SmartInput 
          value={input} 
          onChangeText={setInput} 
          onParsed={handleParsed} 
        />

        <TouchableOpacity 
          style={styles.advancedToggle} 
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          <Text style={[styles.advancedText, { color: theme.textSecondary }]}>
            {showAdvanced ? 'Hide Customization' : 'Customize Manually'}
          </Text>
          <ChevronDown size={16} color={theme.textSecondary} style={{ transform: [{ rotate: showAdvanced ? '180deg' : '0deg' }] }} />
        </TouchableOpacity>

        {showAdvanced && (
          <View style={styles.advancedSection}>
            <View style={styles.row}>
              <TouchableOpacity 
                style={[styles.pickerBtn, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}
                onPress={showDatePicker}
              >
                <Calendar size={18} color={theme.primary} />
                <Text style={{ color: dueDate ? theme.textPrimary : theme.textMuted }}>
                  {dueDate ? format(dueDate, 'MMM d, yyyy') : 'Set Date'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.pickerBtn, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}
                onPress={showTimePicker}
              >
                <Clock size={18} color={theme.primary} />
                <Text style={{ color: dueTime ? theme.textPrimary : theme.textMuted }}>
                  {dueTime ? format(dueTime, 'h:mm a') : 'Set Time'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Priority</Text>
            <View style={styles.pillRow}>
              {(['low', 'medium', 'high'] as Priority[]).map(p => (
                <TouchableOpacity 
                  key={p}
                  style={[
                    styles.pill, 
                    { backgroundColor: priority === p ? theme.primary : theme.surface, borderColor: theme.surfaceBorder }
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={{ color: priority === p ? theme.textOnPrimary : theme.textSecondary, textTransform: 'capitalize' }}>
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {CATEGORIES.map(c => (
                <TouchableOpacity 
                  key={c.label}
                  style={[
                    styles.pill, 
                    { backgroundColor: category === c.label ? c.color : theme.surface, borderColor: theme.surfaceBorder }
                  ]}
                  onPress={() => setCategory(c.label)}
                >
                  <Text style={{ color: category === c.label ? '#FFF' : theme.textSecondary }}>
                    {c.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={[styles.switchRow, { borderTopColor: theme.surfaceBorder }]}>
              <Text style={{ color: theme.textPrimary, fontSize: typography.md }}>Recurring Task</Text>
              <Switch 
                value={isRecurring} 
                onValueChange={(val) => {
                  setIsRecurring(val);
                  if (val && recurrence === 'none') setRecurrence('daily');
                  if (!val) setRecurrence('none');
                }}
                trackColor={{ false: theme.surfaceBorder, true: theme.primaryLight }}
                thumbColor={isRecurring ? theme.primary : theme.textMuted}
              />
            </View>
            
            {isRecurring && (
              <View style={styles.pillRow}>
                {(['daily', 'weekly', 'monthly'] as Recurrence[]).map(r => (
                  <TouchableOpacity 
                    key={r}
                    style={[
                      styles.pill, 
                      { backgroundColor: recurrence === r ? theme.primary : theme.surface, borderColor: theme.surfaceBorder }
                    ]}
                    onPress={() => setRecurrence(r)}
                  >
                    <Text style={{ color: recurrence === r ? theme.textOnPrimary : theme.textSecondary, textTransform: 'capitalize' }}>
                      {r}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.surfaceBorder }]}>
        <TouchableOpacity 
          style={[styles.saveBtnWrapper, isSaveDisabled && { opacity: 0.45 }]} 
          onPress={handleSave}
          disabled={isSaveDisabled}
        >
          <LinearGradient
            colors={[theme.gradientStart, theme.gradientEnd]}
            style={styles.saveBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.saveBtnText}>Save Task</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  screenTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    marginBottom: spacing.lg,
  },
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  advancedText: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
  },
  advancedSection: {
    marginTop: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  pickerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  pillRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  categoryScroll: {
    marginBottom: spacing.lg,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    borderTopWidth: 1,
  },
  saveBtnWrapper: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    elevation: 3,
  },
  saveBtn: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: typography.md,
    fontWeight: typography.bold,
  }
});
