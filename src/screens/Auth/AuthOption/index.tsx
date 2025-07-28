import {setWelcomeScreen} from '@app/reducers/auth/auth.slice';
import {Images} from '@assets/index';
import AppButton from '@components/AppButton';
import {APP_COLORS} from '@constants/color';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {useDispatch} from 'react-redux';

const AuthOption = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const changeWelcomeScreenStatus = () => {
    dispatch(setWelcomeScreen(false));
  };
  return (
    <ImageBackground
      source={Images.authOptionBackground}
      style={styles.background}>
      <View style={styles.bottomContainer}>
        <AppButton
          btnText={'Sign Up'}
          btnStyle={styles.button}
          btnTextStyle={styles.buttonText}
          onPress={() => {
            navigation.navigate('Signup'), changeWelcomeScreenStatus();
          }}
        />
        <View style={{marginBottom: 18}} />
        <AppButton
          btnText={'Log In'}
          btnStyle={styles.buttonRegerster}
          btnTextStyle={styles.buttonText}
          onPress={() => {
            navigation.navigate('Login'), changeWelcomeScreenStatus();
          }}
        />
        <View style={{marginBottom: 56}} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: APP_COLORS.IMAGE_BACKGROUND_COLOR,
  },
  bottomContainer: {
    flex: 1,
    marginHorizontal: moderateScale(24),
    marginBottom: moderateScale(24),
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: moderateScale(16),
    marginTop: moderateScale(24),
  },
  button: {
    paddingVertical: moderateScale(16),
    paddingHorizontal: moderateScale(48),
    borderRadius: moderateScale(24),
    borderColor: APP_COLORS.BORDER_COLOR,
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  buttonRegerster: {
    backgroundColor: 'transparent',
    paddingVertical: moderateScale(16),
    paddingHorizontal: moderateScale(48),
    borderRadius: 100,
    borderColor: APP_COLORS.BORDER_COLOR,
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '400',
  },
});

export default AuthOption;
