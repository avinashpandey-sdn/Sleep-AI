import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnboardingOne from '@screens/Auth/Onboarding/ScreenOne/onboardingOne';
import OnboardingTwo from '@screens/Auth/Onboarding/ScreenTwo/onboardingTwo';
import AuthOption from '@screens/Auth/AuthOption';
import LoginScreen from '@screens/Auth/Login';
import Signup from '@screens/Auth/Signup';
import OtpVerification from '@screens/Auth/OtpVerification';
import ForgotPasswordScreen from '@screens/Auth/ForgotPasword';

import React from 'react';
import SetNewPassword from '@screens/Auth/SetNewPassword';
import {useSelector} from 'react-redux';
import DrawerStack from 'navigations/drawer';
// import Profile from '@screens/Dashboard/Profile/indexold';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  let routeStack;
  useSelector(state => {
    console.log('state><><<<', state);
    if (state?.auth?.showOnboarding) {
      return null;
    } else if (state?.user?.showOnboarding) {
      routeStack = 'OnboardingOne';
    } else {
      if (Object.keys(state?.auth?.userLoginData).length > 0) {
        routeStack = 'DrawerStack';
      } else {
        routeStack = 'Login';
      }
    }
  });

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={routeStack}>
      <Stack.Screen name="OnboardingOne" component={OnboardingOne} />
      <Stack.Screen name="OnboardingTwo" component={OnboardingTwo} />
      <Stack.Screen name="AuthOption" component={AuthOption} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={Signup} />
      {/* <Stack.Screen name="Profile" component={Profile} /> */}

      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
      />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />
      <Stack.Screen name="SetNewPassword" component={SetNewPassword} />
      <Stack.Screen name="DrawerStack" component={DrawerStack} />
    </Stack.Navigator>
  );
}
