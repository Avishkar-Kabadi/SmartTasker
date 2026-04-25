import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { useProfile, UserProfile } from '../hooks/useProfile';
import { typography, radius, spacing } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Briefcase, GraduationCap, Calendar as CalendarIcon } from 'lucide-react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const { saveProfile } = useProfile();
  const router = useRouter();

  const [name, setName] = useState('');
  const [occupation, setOccupation] = useState<'Student' | 'Working'>('Student');
  const [role, setRole] = useState('');
  const [dob, setDob] = useState<Date | null>(null);

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: dob || new Date(2000, 0, 1),
      onChange: (event, selectedDate) => {
        if (selectedDate) setDob(selectedDate);
      },
      mode: 'date',
      maximumDate: new Date(),
    });
  };

  const handleFinish = async () => {
    if (!name.trim()) return;

    const profile: UserProfile = {
      name: name.trim(),
      occupation,
      role: occupation === 'Working' ? role.trim() : undefined,
      dob: dob ? format(dob, 'yyyy-MM-dd') : undefined,
    };

    await saveProfile(profile);
    router.replace('/(tabs)/home' as any);
  };

  const isFormValid = name.trim().length > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Welcome!</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Let's personalize your SmartTasker experience.</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>What should we call you?</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
              <User size={20} color={theme.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                placeholder="Your Name"
                placeholderTextColor={theme.textMuted}
                value={name}
                onChangeText={setName}
                autoFocus
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>What is your occupation?</Text>
            <View style={styles.row}>
              <TouchableOpacity 
                style={[
                  styles.choiceBtn, 
                  { 
                    backgroundColor: occupation === 'Student' ? theme.primary : theme.surface,
                    borderColor: theme.surfaceBorder 
                  }
                ]}
                onPress={() => setOccupation('Student')}
              >
                <GraduationCap size={20} color={occupation === 'Student' ? '#FFF' : theme.textSecondary} />
                <Text style={[styles.choiceText, { color: occupation === 'Student' ? '#FFF' : theme.textSecondary }]}>Student</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.choiceBtn, 
                  { 
                    backgroundColor: occupation === 'Working' ? theme.primary : theme.surface,
                    borderColor: theme.surfaceBorder 
                  }
                ]}
                onPress={() => setOccupation('Working')}
              >
                <Briefcase size={20} color={occupation === 'Working' ? '#FFF' : theme.textSecondary} />
                <Text style={[styles.choiceText, { color: occupation === 'Working' ? '#FFF' : theme.textSecondary }]}>Working</Text>
              </TouchableOpacity>
            </View>
          </View>

          {occupation === 'Working' && (
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.textPrimary }]}>Job Role / Designation</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
                <TextInput
                  style={[styles.input, { color: theme.textPrimary }]}
                  placeholder="e.g. Software Engineer"
                  placeholderTextColor={theme.textMuted}
                  value={role}
                  onChangeText={setRole}
                />
              </View>
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Date of Birth (Optional)</Text>
            <TouchableOpacity 
              style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}
              onPress={showDatePicker}
            >
              <CalendarIcon size={20} color={theme.textMuted} style={styles.inputIcon} />
              <Text style={[styles.input, { color: dob ? theme.textPrimary : theme.textMuted, marginTop: 14 }]}>
                {dob ? format(dob, 'MMMM d, yyyy') : 'Select your birthday'}
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.surfaceBorder }]}>
          <TouchableOpacity 
            style={[styles.saveBtnWrapper, !isFormValid && { opacity: 0.5 }]} 
            onPress={handleFinish}
            disabled={!isFormValid}
          >
            <LinearGradient
              colors={[theme.gradientStart, theme.gradientEnd]}
              style={styles.saveBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.saveBtnText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: 100,
  },
  header: {
    marginBottom: spacing.xxxl,
  },
  title: {
    fontSize: typography.xxxl,
    fontWeight: typography.bold,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.lg,
  },
  formGroup: {
    marginBottom: spacing.xxl,
  },
  label: {
    fontSize: typography.md,
    fontWeight: typography.semibold,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    height: 56,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.md,
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  choiceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderRadius: radius.lg,
  },
  choiceText: {
    fontSize: typography.md,
    fontWeight: typography.medium,
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
