import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import DrawerStack from '../../drawer';
import Profile from '@screens/Dashboard/Profile';
import MyProfile from '@screens/Dashboard/Profile/MyProfile';
import StartTracker from '@screens/Dashboard/Tracker/startTracker';

const Stack = createNativeStackNavigator();

export default function DashbordStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: '70%',
        },
      }}>
      <Stack.Screen name="DrawerStack" component={DrawerStack} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="MyProfile" component={MyProfile} />
      <Stack.Screen name="StartTracker" component={StartTracker} />
    </Stack.Navigator>
  );
}
