import {Images} from '@assets/index';
import AppImage from '@components/AppImage';
import React from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import styles from './style';
import {useNavigation} from '@react-navigation/native';

const OnboardingOne = () => {
  const navigation = useNavigation();
  const handleSkip = () => {
    navigation.navigate('AuthOption');
  };

  return (
    <ImageBackground source={Images.OnboardingIntro} style={styles.background}>
      <StatusBar barStyle="light-content" backgroundColor={'black'} />
      <SafeAreaView style={styles.container1}>
        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('OnboardingTwo')}>
            <AppImage
              source={Images.stepOne}
              style={{width: moderateScale(53), height: moderateScale(53)}}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default OnboardingOne;
