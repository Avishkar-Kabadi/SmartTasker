import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requireAuth, setRequireAuth] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const hardware = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setIsSupported(hardware && enrolled);

        const savedRequireAuth = await AsyncStorage.getItem('@require_auth');
        if (savedRequireAuth !== null) {
          setRequireAuth(savedRequireAuth === 'true');
        } else {
            // Default is true, so save it
            await AsyncStorage.setItem('@require_auth', 'true');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const toggleRequireAuth = async (val: boolean) => {
    setRequireAuth(val);
    await AsyncStorage.setItem('@require_auth', val ? 'true' : 'false');
  };

  const authenticate = async () => {
    if (!requireAuth) {
      setIsAuthenticated(true);
      return true;
    }
    
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock SmartTasker',
        fallbackLabel: 'Use Device PIN',
        disableDeviceFallback: false,
        cancelLabel: 'Cancel',
      });
      
      if (result.success) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const lock = () => setIsAuthenticated(false);

  return { isAuthenticated, isSupported, loading, authenticate, lock, requireAuth, toggleRequireAuth };
};
