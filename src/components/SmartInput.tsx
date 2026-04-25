import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { typography, radius, spacing } from '../constants/theme';
import { parseTaskInput } from '../utils/nlpParser';
import { ParsedTask } from '../types';
import { Calendar, Tag, AlertCircle, Repeat } from 'lucide-react-native';
import { formatDateDisplay, formatTimeDisplay } from '../utils/dateHelpers';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onParsed: (parsed: ParsedTask) => void;
}

export const SmartInput: React.FC<Props> = ({ value, onChangeText, onParsed }) => {
  const { theme } = useTheme();
  const [parsed, setParsed] = useState<ParsedTask | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value.trim()) {
        const result = parseTaskInput(value);
        setParsed(result);
        onParsed(result);
        
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setParsed(null));
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [value, onParsed]);

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input, 
          { 
            backgroundColor: theme.surfaceElevated, 
            color: theme.textPrimary,
            borderColor: theme.surfaceBorder
          }
        ]}
        placeholder="e.g. Read attention paper by tomorrow 5pm, urgent"
        placeholderTextColor={theme.textMuted}
        value={value}
        onChangeText={onChangeText}
        multiline
        autoFocus
      />
      
      {parsed && (
        <Animated.View style={[
          styles.previewPanel, 
          { 
            backgroundColor: theme.surface,
            borderColor: theme.surfaceBorder,
            opacity: fadeAnim 
          }
        ]}>
          <Text style={[styles.previewTitle, { color: theme.textSecondary }]}>Smart Detection</Text>
          
          <View style={styles.badgeRow}>
            {(parsed.due_date || parsed.due_time) && (
              <View style={[styles.badge, { backgroundColor: theme.info + '20' }]}>
                <Calendar size={12} color={theme.info} />
                <Text style={[styles.badgeText, { color: theme.info }]}>
                  {formatDateDisplay(parsed.due_date)} {formatTimeDisplay(parsed.due_time)}
                </Text>
              </View>
            )}
            
            <View style={[styles.badge, { backgroundColor: theme.accent + '20' }]}>
              <Tag size={12} color={theme.accent} />
              <Text style={[styles.badgeText, { color: theme.accent }]}>{parsed.category}</Text>
            </View>
            
            {parsed.priority !== 'medium' && (
              <View style={[styles.badge, { backgroundColor: parsed.priority === 'high' ? theme.danger + '20' : theme.success + '20' }]}>
                <AlertCircle size={12} color={parsed.priority === 'high' ? theme.danger : theme.success} />
                <Text style={[styles.badgeText, { color: parsed.priority === 'high' ? theme.danger : theme.success }]}>
                  {parsed.priority.charAt(0).toUpperCase() + parsed.priority.slice(1)} Priority
                </Text>
              </View>
            )}
            
            {parsed.isRecurring && (
              <View style={[styles.badge, { backgroundColor: theme.primary + '20' }]}>
                <Repeat size={12} color={theme.primary} />
                <Text style={[styles.badgeText, { color: theme.primary }]}>
                  {parsed.recurrence.charAt(0).toUpperCase() + parsed.recurrence.slice(1)}
                </Text>
              </View>
            )}
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  input: {
    minHeight: 100,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    fontSize: typography.md,
    textAlignVertical: 'top',
  },
  previewPanel: {
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  previewTitle: {
    fontSize: typography.xs,
    fontWeight: typography.bold,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  badgeText: {
    fontSize: typography.xs,
    fontWeight: typography.medium,
  }
});
