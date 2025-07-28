import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import AuthStack from './AuthStack';
import DashbordStack from './DashbordStack';
import MySubscriptions from '@screens/Subscription/MySubscriptions';
import ChangePlan from '@screens/Subscription/ChangePlan';
import Payment from '@screens/Subscription/Payment';
import SubscriptionHistory from '@screens/Subscription/SubscriptionHistory';
import SleepNotes from '@screens/Dashboard/Report/SleepNotes';
const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name="DashbordStack" component={DashbordStack} />
      <Stack.Screen name="MySubscription" component={MySubscriptions} />
      <Stack.Screen name="ChangePlan" component={ChangePlan} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen
        name="SubscriptionHistory"
        component={SubscriptionHistory}
      />
    <Stack.Screen
        name="SleepNotes"
        component={SleepNotes}
      />
    </Stack.Navigator>
  );
}
