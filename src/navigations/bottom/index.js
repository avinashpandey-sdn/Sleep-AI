import {Images} from '@assets/index';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Image, Platform} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import HomeScreen from '../../screens/Dashboard/Home';
import CustomTabBar from './CustomTabBar';
import Appoiment from '@screens/Dashboard/Appoiment';
import Report from '@screens/Dashboard/Report';
import Stat from '@screens/Dashboard/Stat';
import Tracker from '@screens/Dashboard/Tracker';

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({focused}) => {
          let iconSource;
          if (route.name === 'HomeScreen') {
            iconSource = focused ? Images.HomeScreenFill : Images.HomeScreen;
          } else if (route.name === 'Appoiment') {
            iconSource = focused ? Images.AppoimentFill : Images.Appoiment;
          } else if (route.name === 'Tracker') {
            iconSource = focused ? Images.Tracker : Images.Tracker;
          } else if (route.name === 'Report') {
            iconSource = focused ? Images.ReportFill : Images.Report;
          } else if (route.name === 'Stat') {
            iconSource = focused ? Images.StatFill : Images.Stat;
          }

          if (route.name === 'Tracker') {
            return (
              <Image
                source={iconSource}
                style={{
                  width: moderateScale(64),
                  height: moderateScale(64),
                  marginBottom: Platform.OS == 'android' ? 80 : 80,
                  resizeMode: 'contain',
                  zIndex: 99,
                }}
              />
            );
          } else {
            return (
              <Image
                source={iconSource}
                style={{
                  width: moderateScale(48),
                  height: moderateScale(48),
                  resizeMode: 'contain',
                }}
              />
            );
          }
        },
        tabBarStyle: {
          backgroundColor: 'transparent',
          opacity: 0.9,
          borderTopWidth: 0,
          elevation: 0,
          marginBottom: -30,
        },
      })}>
      <Tab.Screen name={'HomeScreen'} component={HomeScreen} />
      <Tab.Screen name={'Appoiment'} component={Appoiment} />
      <Tab.Screen name={'Tracker'} component={Tracker} />
      <Tab.Screen name={'Report'} component={Report} />
      <Tab.Screen name={'Stat'} component={Stat} />
    </Tab.Navigator>
  );
}
