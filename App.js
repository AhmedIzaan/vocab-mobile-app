import { useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import {
  useFonts,
  Newsreader_400Regular,
  Newsreader_400Regular_Italic,
  Newsreader_600SemiBold,
  Newsreader_700Bold,
} from '@expo-google-fonts/newsreader';
import { Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { SourceSerif4_400Regular } from '@expo-google-fonts/source-serif-4';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider, useAuthContext } from './src/auth/AuthContext';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { GameProvider } from './src/gamification/GameContext';
import { LevelUpModal } from './src/components/shared/LevelUpModal';
import { AppNavigator } from './src/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync();

function getInitialAuthRoute(profile) {
  if (!profile || profile.username === null) return 'Onboarding';
  return 'Main';
}

// Root is inside AuthProvider + ThemeProvider so it can read both contexts.
// GameProvider lives here so useGameState can call useAuthContext() and
// initialise each user's XP/level/streak from their Supabase profile.
function Root() {
  const { user, profile, loading, isGuest } = useAuthContext();
  const { theme } = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator color={theme.accentTerracotta} />
      </View>
    );
  }

  return (
    <GameProvider>
      <AppNavigator
        isAuthenticated={!!user}
        isGuest={isGuest}
        initialAuthRoute={getInitialAuthRoute(profile)}
      />
      <LevelUpModal />
    </GameProvider>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Newsreader_400Regular,
    Newsreader_400Regular_Italic,
    Newsreader_600SemiBold,
    Newsreader_700Bold,
    Inter_400Regular,
    Inter_600SemiBold,
    SourceSerif4_400Regular,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AuthProvider>
          <ThemeProvider>
            <Root />
          </ThemeProvider>
        </AuthProvider>
      </View>
    </GestureHandlerRootView>
  );
}
