import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { typography, spacing } from '../constants/theme';
import { Lock, Fingerprint } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LockScreen() {
  const { authenticate, loading, isSupported, requireAuth } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
      ])
    ).start();
  }, []);

  useEffect(() => {
    const checkInitialState = async () => {
      if (!loading) {
        const profileStr = await AsyncStorage.getItem('@user_profile');
        if (!profileStr) {
          router.replace('/onboarding' as any);
          return;
        }

        if (!requireAuth) {
           router.replace('/(tabs)/home' as any);
           return;
        }
        
        const timer = setTimeout(() => {
          handleAuth();
        }, 500);
        return () => clearTimeout(timer);
      }
    };
    
    checkInitialState();
  }, [loading, requireAuth]);

  const handleAuth = async () => {
    const success = await authenticate();
    if (success) {
      router.replace('/(tabs)/home' as any);
    }
  };

  if (loading) return <View style={[styles.container, { backgroundColor: theme.background }]} />;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.iconContainer}>
          <Lock size={64} color={theme.primary} />
        </View>
        
        <Text style={[styles.title, { color: theme.textPrimary }]}>SmartTasker</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Your tasks, secured.</Text>
        
        <Animated.View style={[styles.authSection, { transform: [{ scale: pulseAnim }] }]}>
          <Fingerprint size={48} color={theme.accent} opacity={0.8} />
        </Animated.View>
        
        <TouchableOpacity style={styles.buttonWrapper} onPress={handleAuth}>
          <LinearGradient
            colors={[theme.gradientStart, theme.gradientEnd]}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.buttonText, { color: theme.textOnPrimary }]}>
              {isSupported ? 'Unlock' : 'Unlock with Device Credential'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
      
      <View style={styles.footer}>
        <Text style={[styles.dateText, { color: theme.textMuted }]}>
          {format(new Date(), 'EEEE, MMMM d')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.xxxl,
    fontWeight: typography.bold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.md,
    marginBottom: spacing.xxxl * 2,
  },
  authSection: {
    marginBottom: spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  buttonWrapper: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  button: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: typography.md,
    fontWeight: typography.semibold,
  },
  footer: {
    position: 'absolute',
    bottom: spacing.xxl,
  },
  dateText: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
  }
});
