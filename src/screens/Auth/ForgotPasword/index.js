import {postRequest} from '@api/apiService';
import {APIS} from '@api/apiSheet';
import {Images} from '@assets/index';
import AppButton from '@components/AppButton';
import AppImage from '@components/AppImage';
import AppText from '@components/AppText';
import {APP_COLORS} from '@constants/color';
import {useMutation} from '@tanstack/react-query';
import React, {useState} from 'react';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {showError, showSuccess} from 'utils/alerts';

const ForgotPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      showError('Error', 'Email is required.');
      return false;
    }
    if (!emailRegex.test(email)) {
      showError('Error', 'Enter a valid email.');
      return false;
    }

    return true;
  };
  const forgetPasswordOtpMutation = useMutation({
    mutationFn: payload => postRequest(APIS.FORGOT_PASSWORD, payload),
    onSuccess: data => {
      console.log('User forget password:', data);
      showSuccess('Success', data?.message);
      if (data?.success) {
        navigation.navigate('OtpVerification', {
          backScreenName: 'ForgotPassword',
          email: email,
          userId: data?.data?._id,
        });
      }
    },
    onError: error => {
      console.error('Error login user:', error);
      showError('Success', error?.message);
    },
  });

  const handleSubmit = async () => {
    console.log('Email:', email);
    if (await validateForm()) {
      let payload = {
        email: email,
      };
      forgetPasswordOtpMutation.mutate(payload);
    }
  };

  return (
    <ImageBackground source={Images.background} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{paddingTop: Platform.OS == 'android' && moderateScale(16)}}>
          <AppImage
            source={Images.back}
            style={{width: moderateScale(30), height: moderateScale(30)}}
          />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.formBackground}>
            <AppText
              style={{
                color: APP_COLORS.WHITE,
                fontWeight: '400',
                fontSize: moderateScale(20),
                textAlign: 'center',
              }}>
              Forgot your Password?
            </AppText>
            <AppText
              style={{
                color: APP_COLORS.TEXT_COLOR,
                fontSize: moderateScale(14),
                fontWeight: '300',
                textAlign: 'center',
                marginTop: moderateScale(8),
              }}>
              Don't worry we got you.Enter your email address.
            </AppText>

            <View>
              <View style={{marginTop: moderateScale(16)}} />
              <View style={styles.input}>
                <AppImage
                  source={Images.email}
                  style={{
                    width: moderateScale(18),
                    height: moderateScale(18),
                    marginRight: moderateScale(8),
                  }}
                />
                <TextInput
                  placeholder="Enter your Email"
                  placeholderTextColor={APP_COLORS.PLACEHOLDER_TEXT_COLOR}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.inputText}
                />
              </View>

              <TouchableOpacity
                style={styles.bottomContainer}
                onPress={handleSubmit}>
                <AppButton
                  btnText={'Done'}
                  btnStyle={[styles.button]}
                  btnTextStyle={styles.buttonText}
                  onPress={handleSubmit}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, marginHorizontal: moderateScale(24)},
  scroll: {flexGrow: 1, alignItems: 'center', marginTop: moderateScale(16)},
  formBackground: {
    padding: moderateScale(22),
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: APP_COLORS.BORDER_COLOR,
    borderRadius: 40,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },

  input: {
    borderWidth: 1,
    borderColor: APP_COLORS.TEXT_INPUT_BORDER_COLOR,
    borderRadius: 100,
    alignItems: 'center',
    flexDirection: 'row',
    height: moderateScale(50),
    paddingLeft: moderateScale(18),
  },
  bottomContainer: {
    marginTop: moderateScale(34),
  },
  button: {
    backgroundColor: '#6832C4',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 24,
    borderColor: '#AB9BDD',
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
  },
  inputText: {
    flex: 1,
    color: '#FFFFFF',
  },
});

export default ForgotPasswordScreen;
