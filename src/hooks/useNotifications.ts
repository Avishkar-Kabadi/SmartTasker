import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { requestNotificationPermissions } from '../utils/notificationScheduler';

export const useNotifications = () => {
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const perms = await requestNotificationPermissions();
      const saved = await AsyncStorage.getItem('@notifications_enabled');
      if (saved !== null) {
        setEnabled(saved === 'true' && perms);
      } else {
        setEnabled(perms);
        await AsyncStorage.setItem('@notifications_enabled', perms ? 'true' : 'false');
      }
      setLoading(false);
    };
    init();
  }, []);

  const toggleNotifications = async (val: boolean) => {
    if (val) {
      const perms = await requestNotificationPermissions();
      if (!perms) return false;
    }
    setEnabled(val);
    await AsyncStorage.setItem('@notifications_enabled', val ? 'true' : 'false');
    
    if (!val) {
        // Cancel all if disabled
        await Notifications.cancelAllScheduledNotificationsAsync();
    }
    return true;
  };

  return { enabled, loading, toggleNotifications };
};
