import React from 'react';
import {ImageBackground, StatusBar} from 'react-native';
import {styles} from './styles';

const SplashScreen = () => {
  return (
    <>
      <StatusBar hidden />
      <ImageBackground
        source={require('../../assets/images/splashScreen.png')}
        style={styles.splashContainer}
      />
    </>
  );
};
export default SplashScreen;
