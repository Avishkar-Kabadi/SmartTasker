import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { initDatabase } from '../db/database';
import { ThemeProvider } from '../hooks/useTheme';

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const appState = useRef(AppState.currentState);
  const backgroundTime = useRef<number | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        await initDatabase();
        // Request notifications permission
        await Notifications.requestPermissionsAsync();
        
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      const taskId = response.notification.request.content.data?.taskId;
      if (taskId) {
        // Navigate to home and ideally highlight it. Here we just navigate.
        router.replace('/(tabs)/home' as any);
      }
    });

    return () => {
      responseListener.remove();
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      if (appState.current.match(/active/) && nextAppState.match(/inactive|background/)) {
        backgroundTime.current = Date.now();
      }

      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        const timeInBackground = Date.now() - (backgroundTime.current || Date.now());
        const requireAuth = await AsyncStorage.getItem('@require_auth');
        
        // If in background for > 30 seconds and auth is required
        if (timeInBackground > 30000 && requireAuth !== 'false') {
          router.replace('/' as any);
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="all-tasks" options={{ animation: 'slide_from_bottom' }} />
      </Stack>
    </ThemeProvider>
  );
}
