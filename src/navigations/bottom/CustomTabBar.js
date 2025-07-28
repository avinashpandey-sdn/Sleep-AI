import {Images} from '@assets/index';
import {BottomTabBar} from '@react-navigation/bottom-tabs';
import React from 'react';
import {ImageBackground, View} from 'react-native';
const CustomTabBar = props => {
  return (
    <ImageBackground
      source={Images.bottomTabBGOne}
      style={{
        height: 100,
        justifyContent: 'center',
        tintColor: '#ffffff',
        // backgroundColor: props?.state?.index === 2 ? '#FFF9F1' : '#FFF',
        backgroundColor: '#160E3B',
      }}>
      <View
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
        }}>
        <BottomTabBar {...props} />
      </View>
    </ImageBackground>
  );
};

export default CustomTabBar;
