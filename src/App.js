import {NavigationContainer} from '@react-navigation/native';
import {StripeProvider} from '@stripe/stripe-react-native';
import {QueryClientProvider} from '@tanstack/react-query';
import {useEffect, useRef, useState} from 'react';
import {Animated, StatusBar, StyleSheet} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './app/store';
import RootStack from './navigations/stack';
import {queryClient} from './query/client';

export default function App() {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

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
              <StripeProvider publishableKey="pk_test_51M6pC4SJ597y6Pdt76YEEshbnNdE8zdrunAfkQVxiQhcuTeSfmkx0SFlRdOG7xQ3RqqPYYF0jsGA0jYhR8qQy4aO004pB8BxY2">
                <KeyboardProvider>
                  <NavigationContainer>
                    <RootStack />
                  </NavigationContainer>
                </KeyboardProvider>
              </StripeProvider>

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
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
  },
});
