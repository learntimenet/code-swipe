import { useReducer } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, SpaceGrotesk_500Medium, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { JetBrainsMono_400Regular, JetBrainsMono_600SemiBold } from '@expo-google-fonts/jetbrains-mono';

import { LanguageProvider } from './src/i18n/LanguageContext';
import { gameReducer, initialGameState } from './src/game/gameReducer';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { colors } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_600SemiBold,
  });
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <StatusBar style="light" />
        <SafeAreaView style={styles.root} edges={['top', 'bottom', 'left', 'right']}>
          {!fontsLoaded ? (
            <View style={styles.loading}>
              <ActivityIndicator color={colors.accent} />
            </View>
          ) : state.screen === 'home' ? (
            <HomeScreen state={state} dispatch={dispatch} />
          ) : state.screen === 'game' ? (
            <GameScreen state={state} dispatch={dispatch} />
          ) : (
            <ResultScreen state={state} dispatch={dispatch} />
          )}
        </SafeAreaView>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
