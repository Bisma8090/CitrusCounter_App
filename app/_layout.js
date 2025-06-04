import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import Splash from './screens/SplashScreen'; // ✅ Import your custom splash component (adjust path if needed)

// Prevent the native splash from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      if (loaded) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Delay splash 3s
        setIsReady(true);
        await SplashScreen.hideAsync(); // Hide native splash
      }
    };
    prepare();
  }, [loaded]);

  if (!isReady) {
    return <Splash />; // ✅ Show your custom splash here
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
