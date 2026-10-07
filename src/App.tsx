import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

import { color } from './theme';
import { AppProvider, useApp } from './state/AppContext';
import { OrderBanner } from './components/OrderBanner';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { OrderDetailsScreen } from './screens/OrderDetailsScreen';
import { OrderHistoryScreen } from './screens/OrderHistoryScreen';
import { TrackOrderScreen } from './screens/TrackOrderScreen';
import { AddAddressScreen } from './screens/AddAddressScreen';
import { ActivityScreen } from './screens/ActivityScreen';
import { SavingsScreen } from './screens/SavingsScreen';
import { OrdersScreen, MoreScreen } from './screens/OrdersScreen';

SplashScreen.preventAutoHideAsync().catch(() => {
  /* already hidden — safe to ignore */
});

/** Maps the current route onto its screen. */
function Router() {
  const { state } = useApp();
  const { name } = state.route;

  switch (name) {
    case 'login':
      return <LoginScreen />;
    case 'home':
      return <HomeScreen />;
    case 'orderDetails':
      return <OrderDetailsScreen dishId={state.route.dishId} />;
    case 'orderHistory':
      return <OrderHistoryScreen orderId={state.route.orderId} />;
    case 'trackOrder':
      return <TrackOrderScreen />;
    case 'addAddress':
      return <AddAddressScreen />;
    case 'activity':
      return <ActivityScreen />;
    case 'savings':
      return <SavingsScreen />;
    case 'orders':
      return <OrdersScreen />;
    case 'more':
      return <MoreScreen />;
    default:
      return <HomeScreen />;
  }
}

function Shell() {
  const { state } = useApp();
  // Login paints a full blue canvas, so its status bar glyphs must stay light.
  const lightContent = state.route.name !== 'login';

  return (
    <View style={styles.root}>
      <ExpoStatusBar style={lightContent ? 'dark' : 'light'} />
      <Router />
      {/* Above every screen, including pushed routes and the tab bar. */}
      <OrderBanner />
    </View>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    // Hold the splash until Inter is ready so text never renders in a fallback face.
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return <View style={styles.splash} />;
  }

  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.surface },
  splash: { flex: 1, backgroundColor: color.brand },
});
