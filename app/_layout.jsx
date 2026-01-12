import { Stack, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { initDB, prepopulateUsers } from '../database/db';

import InactivityWrapper from '../app/screens/InactivityScreen'

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const segments = useSegments();

  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "BaraBara": require("../assets/fonts/BARABARA-final.otf"),
    "Arial-Regular": require("../assets/fonts/Arial-Regular.ttf"),
    "Arial-Medium": require("../assets/fonts/Arial-Medium.ttf"),
    "Arial-Bold": require("../assets/fonts/Arial-Bold.ttf"),
    "Arial-Bold-1": require("../assets/fonts/Arial-Bold-1.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
    NavigationBar.setBehaviorAsync("inset-swipe"); 
  }, [segments]);

  useEffect(() => {
    const setup = async () => {
      await initDB();
      await prepopulateUsers();
    };
    setup();
  }, []);
  

  if (!fontsLoaded && !error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar hidden />
      <InactivityWrapper>
        <Stack screenOptions={{ headerShown: false }} />
      </InactivityWrapper>
    </>
  );
}
