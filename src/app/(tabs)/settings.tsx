import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { typography, radius, spacing } from '../../constants/theme';
import { Moon, Sun, Smartphone, Bell, Lock, Download, Trash2, Info, ChevronRight, List } from 'lucide-react-native';
import * as db from '../../db/database';

export default function SettingsTab() {
  const { theme, mode, setMode } = useTheme();
  const { requireAuth, toggleRequireAuth, authenticate } = useAuth();
  const { enabled: notificationsEnabled, toggleNotifications } = useNotifications();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleTestAuth = async () => {
    const success = await authenticate();
    if (success) {
      Alert.alert('Success', 'Authentication successful!');
    }
  };

  const handleClearCompleted = async () => {
    Alert.alert(
      'Clear Completed Tasks',
      'Are you sure you want to delete all completed tasks?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const database = db.getDb();
            await database.runAsync(`DELETE FROM tasks WHERE status = 'completed'`);
            Alert.alert('Success', 'Completed tasks deleted.');
          }
        }
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete ALL tasks and insights. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: async () => {
             const database = db.getDb();
             await database.runAsync(`DELETE FROM tasks`);
             await database.runAsync(`DELETE FROM task_events`);
             Alert.alert('Success', 'All data reset.');
          }
        }
      ]
    );
  };

  const handleExportData = async () => {
    try {
      const allTasks = await db.getAllTasks();
      const jsonData = JSON.stringify(allTasks, null, 2);
      
      const file = new File(Paths.cache, 'SmartTasker_Export.json');
      file.write(jsonData);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, {
          mimeType: 'application/json',
          dialogTitle: 'Export Tasks',
        });
      } else {
        Alert.alert('Error', 'Sharing is not available on this device.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to export data.');
    }
  };

  const renderSectionHeader = (title: string) => (
    <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{title}</Text>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]} edges={['right', 'left']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Settings</Text>

        {renderSectionHeader('Appearance')}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
          <View style={styles.themeSelector}>
            <TouchableOpacity 
              style={[styles.themeBtn, mode === 'system' && { backgroundColor: theme.primary + '20' }]} 
              onPress={() => setMode('system')}
            >
              <Smartphone size={20} color={mode === 'system' ? theme.primary : theme.textSecondary} />
              <Text style={[styles.themeText, { color: mode === 'system' ? theme.primary : theme.textSecondary }]}>System</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.themeBtn, mode === 'light' && { backgroundColor: theme.primary + '20' }]} 
              onPress={() => setMode('light')}
            >
              <Sun size={20} color={mode === 'light' ? theme.primary : theme.textSecondary} />
              <Text style={[styles.themeText, { color: mode === 'light' ? theme.primary : theme.textSecondary }]}>Light</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.themeBtn, mode === 'dark' && { backgroundColor: theme.primary + '20' }]} 
              onPress={() => setMode('dark')}
            >
              <Moon size={20} color={mode === 'dark' ? theme.primary : theme.textSecondary} />
              <Text style={[styles.themeText, { color: mode === 'dark' ? theme.primary : theme.textSecondary }]}>Dark</Text>
            </TouchableOpacity>
          </View>
        </View>

        {renderSectionHeader('Notifications')}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.primary + '20' }]}>
                <Bell size={18} color={theme.primary} />
              </View>
              <Text style={[styles.rowText, { color: theme.textPrimary }]}>Enable Notifications</Text>
            </View>
            <Switch 
              value={notificationsEnabled} 
              onValueChange={(val) => { toggleNotifications(val); }}
              trackColor={{ false: theme.surfaceBorder, true: theme.primaryLight }}
              thumbColor={notificationsEnabled ? theme.primary : theme.textMuted}
            />
          </View>
        </View>

        {renderSectionHeader('Security')}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
          <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: theme.surfaceBorder, paddingBottom: spacing.md, marginBottom: spacing.md }]}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.primary + '20' }]}>
                <Lock size={18} color={theme.primary} />
              </View>
              <Text style={[styles.rowText, { color: theme.textPrimary }]}>Require Auth on Open</Text>
            </View>
            <Switch 
              value={requireAuth} 
              onValueChange={toggleRequireAuth}
              trackColor={{ false: theme.surfaceBorder, true: theme.primaryLight }}
              thumbColor={requireAuth ? theme.primary : theme.textMuted}
            />
          </View>
          
          <TouchableOpacity style={styles.row} onPress={handleTestAuth}>
            <View style={styles.rowLeft}>
              <Text style={[styles.rowText, { color: theme.primary, marginLeft: 40 }]}>Test Authentication</Text>
            </View>
            <ChevronRight size={18} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {renderSectionHeader('Tasks')}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
          <TouchableOpacity style={styles.row} onPress={() => router.push('/all-tasks' as any)}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.primary + '20' }]}>
                <List size={18} color={theme.primary} />
              </View>
              <Text style={[styles.rowText, { color: theme.textPrimary }]}>View All Tasks</Text>
            </View>
            <ChevronRight size={18} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {renderSectionHeader('Data')}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
          <TouchableOpacity style={[styles.row, { borderBottomWidth: 1, borderBottomColor: theme.surfaceBorder, paddingBottom: spacing.md, marginBottom: spacing.md }]} onPress={handleExportData}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.info + '20' }]}>
                <Download size={18} color={theme.info} />
              </View>
              <Text style={[styles.rowText, { color: theme.textPrimary }]}>Export Tasks (JSON)</Text>
            </View>
            <ChevronRight size={18} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.row, { borderBottomWidth: 1, borderBottomColor: theme.surfaceBorder, paddingBottom: spacing.md, marginBottom: spacing.md }]} onPress={handleClearCompleted}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.warning + '20' }]}>
                <Trash2 size={18} color={theme.warning} />
              </View>
              <Text style={[styles.rowText, { color: theme.textPrimary }]}>Clear Completed Tasks</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={handleResetData}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.danger + '20' }]}>
                <Trash2 size={18} color={theme.danger} />
              </View>
              <Text style={[styles.rowText, { color: theme.danger }]}>Reset All Data</Text>
            </View>
          </TouchableOpacity>
        </View>

        {renderSectionHeader('About')}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.textMuted + '30' }]}>
                <Info size={18} color={theme.textSecondary} />
              </View>
              <View>
                <Text style={[styles.rowText, { color: theme.textPrimary }]}>SmartTasker Version</Text>
                <Text style={{ color: theme.textSecondary, fontSize: typography.xs, marginTop: 2 }}>Built with Expo SDK 54</Text>
              </View>
            </View>
            <Text style={{ color: theme.textMuted }}>1.0.0</Text>
          </View>
        </View>

      </ScrollView>
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
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sm,
    fontWeight: typography.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  themeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  themeText: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowText: {
    fontSize: typography.base,
    fontWeight: typography.medium,
  }
});
