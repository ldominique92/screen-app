import { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/SplashScreen/SplashScreen';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

export default function App() {
  const [fontLoaded, setFontLoaded] = useState<boolean>(false);

  const fetchFonts = () => {
    return Font.loadAsync({
      'Remachine-Script': require("./assets/fonts/Remachine-Script.ttf"),
      'Roboto-Thin': require("./assets/fonts/Roboto-Thin.ttf"),
      'Roboto-Light': require("./assets/fonts/Roboto-Light.ttf"),
      'Roboto-Medium': require("./assets/fonts/Roboto-Medium.ttf")
    });
  };

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={console.warn}
      />
    ); }

  return (
    <SafeAreaProvider>
      <StatusBar hidden={true} />
      <SplashScreen />
    </SafeAreaProvider>
  );
}