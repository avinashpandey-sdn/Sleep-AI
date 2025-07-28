import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Animated, StatusBar, StyleSheet} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import 'react-native-gesture-handler';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RootStack from './navigations/stack';
import SplashScreen from './screens/SplashScreen';
import {Provider, useDispatch} from 'react-redux';
import {persistor, store} from './app/store';
import {PersistGate} from 'redux-persist/integration/react';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from './query/client';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  GET_FCM_TOKEN,
  handleForegroundNotifications,
  listenToForegroundFCM,
  requestNotificationPermission,
} from 'pushNotification/notification.notifee';
import DrawerStack from 'navigations/drawer';
import {StripeProvider} from '@stripe/stripe-react-native';

// import {Button, Text} from '@react-navigation/elements';
const App: React.FC = () => {
  /** Splash screen  */

  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  // useEffect(() => {
  //   GET_FCM_TOKEN();
  //   requestNotificationPermission();
  //   const unsubscribeForegroundFCM = listenToForegroundFCM(dispatch);
  //   const unsubscribeForegroundEvent = handleForegroundNotifications();

  //   return () => {
  //     unsubscribeForegroundFCM();
  //     unsubscribeForegroundEvent();
  //   };
  // }, [dispatch]);
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowSplashScreen(false);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplashScreen) {
    return (
      <Animated.View
        style={[styles.splashContainer, {opacity: fadeAnim}]}></Animated.View>
    );
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
              <KeyboardProvider>
                {/* publishable key to be exposed here  */}
                <StripeProvider publishableKey="pk_test_51Rl3C6Ct9LT5G3VIrEOrPk81Yloy3NzJC1kWtcbmdHzK3JcIG6ep6H3PxVjlF7YVoXb1JtESFiDW1Wk1M6XhUWc300uLacMjGE">
                  <NavigationContainer>
                    <RootStack />
                  </NavigationContainer>
                </StripeProvider>
              </KeyboardProvider>
              <FlashMessage
                position="top"
                statusBarHeight={StatusBar.currentHeight}
                duration={5000}
              />
            </SafeAreaProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
  },
});

export default App;
