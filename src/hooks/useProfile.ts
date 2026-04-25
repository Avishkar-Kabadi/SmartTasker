import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleBirthdayReminder } from '../utils/notificationScheduler';

export interface UserProfile {
  name: string;
  occupation: 'Student' | 'Working';
  role?: string;
  dob?: string; // Format: YYYY-MM-DD
}

const PROFILE_STORAGE_KEY = '@user_profile';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (data) {
        setProfile(JSON.parse(data));
      } else {
        setProfile(null);
      }
    } catch (e) {
      console.error('Failed to load profile:', e);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (newProfile: UserProfile) => {
    try {
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
      setProfile(newProfile);
      
      // Schedule birthday reminder if DOB is provided
      if (newProfile.dob) {
        await scheduleBirthdayReminder(newProfile.dob, newProfile.name);
      }
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  };

  const clearProfile = async () => {
    try {
      await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
      setProfile(null);
    } catch (e) {
      console.error('Failed to clear profile:', e);
    }
  };

  return {
    profile,
    loading,
    saveProfile,
    clearProfile,
    reloadProfile: loadProfile,
  };
}
