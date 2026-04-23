import { useCallback } from 'react';
import { View } from 'react-native';
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
import { ThemeProvider } from './src/theme/ThemeContext';
import { GameProvider } from './src/gamification/GameContext';
import { LevelUpModal } from './src/components/shared/LevelUpModal';
import { AppNavigator } from './src/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync();

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
        <ThemeProvider>
          <GameProvider>
            <AppNavigator />
            <LevelUpModal />
          </GameProvider>
        </ThemeProvider>
      </View>
    </GestureHandlerRootView>
  );
}
