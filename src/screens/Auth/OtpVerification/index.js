import {postRequest} from '@api/apiService';
import {APIS} from '@api/apiSheet';
import {setLoguserId, setUserLoginData} from '@app/reducers/auth/auth.slice';
import {Images} from '@assets/index';
import AppButton from '@components/AppButton';
import AppImage from '@components/AppImage';
import AppText from '@components/AppText';
import {APP_COLORS} from '@constants/color';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useMutation} from '@tanstack/react-query';
import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {OtpInput} from 'react-native-otp-entry';
import {moderateScale} from 'react-native-size-matters';
import {useDispatch} from 'react-redux';
import {showError, showSuccess} from 'utils/alerts';

const OtpVerification = ({}) => {
  const [otp, setOtp] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  console.log('route><><><><>><<', route);
  const dispatch = useDispatch();

  const sendOtpMutation = useMutation({
    mutationFn: payload => postRequest(APIS.SENT_OTP, payload),
    onSuccess: data => {
      console.log('User SENT_OTP successfully:', data);
      showSuccess('Success', data?.message);
    },
    onError: error => {
      console.error('Error login user:', error);
      showError('Success', error?.message);
    },
  });
  const forgetPasswordOtpMutation = useMutation({
    mutationFn: payload => postRequest(APIS.FORGOT_PASSWORD, payload),
    onSuccess: data => {
      console.log('User forget password:', data);
      showSuccess('Success', data?.message);
    },
    onError: error => {
      console.error('Error login user:', error);
      showError('Success', error?.message);
    },
  });
  const VerifyuMutation = useMutation({
    mutationFn: payload => postRequest(APIS.VERIFY_OTP, payload),
    onSuccess: data => {
      console.log('otp verification response:', data);

      if (data?.success) {
        showSuccess('Success', data?.message);
        if (route?.params?.backScreenName == 'Login') {
          navigation.navigate('DashbordStack');
          dispatch(setUserLoginData(data?.data));
          let payload = {
            action: 'Login', //Logout
            user: {
              email: data?.data?.userData?.email,
              fullName: data?.data?.userData?.fullName,
              role: 'Patient',
              userId: data?.data?.userData?._id,
            },
          };
          postLogApi.mutate(payload);
        } else {
          navigation.navigate('SetNewPassword');
        }
      } else {
        showError('Success', data?.message);
      }
    },
    onError: error => {
      console.error('Error login user:', error);
      showError('Success', error?.message);
    },
  });
  const postLogApi = useMutation({
    mutationFn: payload => postRequest(APIS.LOGAPI, payload),
    onSuccess: data => {
      console.log('User login successfully:', data);
      if (data?.data?._id) {
        dispatch(setLoguserId(data?.data?._id));
      }
    },
    onError: error => {
      console.error('Error login user:', error);
    },
  });

  const VerifyForgetOtp = useMutation({
    mutationFn: payload => postRequest(APIS.VERIFY_FORGET_OTP, payload),
    onSuccess: data => {
      console.log(' verify forget otp res: ', data);

      if (data?.success) {
        showSuccess('Success', data?.message);
        if (route?.params?.backScreenName == 'Login') {
          navigation.navigate('DashbordStack');
          showSuccess('Success', data?.message);
        } else {
          navigation.navigate('SetNewPassword', {
            email: route?.params?.email,
          });
        }
      } else {
        showError('Success', data?.message);
      }
    },
    onError: error => {
      console.error('Error login user:', error);
      showError('Success', error?.message);
    },
  });

  const sendOtp = () => {
    if (route?.params?.email) {
      const payload = {
        email: route.params.email,
      };
      sendOtpMutation.mutate(payload);
    }
  };
  useEffect(() => {
    if (route?.params?.backScreenName == 'Login') {
      sendOtp();
    }
  }, [route?.params]);

  const handleVerify = () => {
    if (otp.length === 4) {
      console.log('route><><>', route?.params);
      let payload = {
        email: route?.params?.email,
        otp: otp,
        userId: route?.params?.userId,
      };
      if (route?.params?.backScreenName == 'Login') {
        VerifyuMutation.mutate(payload);
      } else {
        VerifyForgetOtp.mutate(payload);
      }
    } else {
      showError('Error', 'Please enter a valid 4-digit OTP.');
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
              Verification Code
            </AppText>
            <AppText
              style={{
                color: APP_COLORS.TEXT_COLOR,
                fontSize: moderateScale(14),
                fontWeight: '300',
                textAlign: 'center',
                marginTop: moderateScale(8),
              }}>
              Enter the verification code we just sent on your Email ID.
            </AppText>

            <View>
              <View style={{marginTop: moderateScale(16)}} />
              <OtpInput
                numberOfDigits={4}
                onTextChange={text => setOtp(text)}
                focusColor={'#6832C4'}
                inputTextStyle={{
                  color: APP_COLORS.WHITE,
                }}
                theme={{
                  containerStyle: {
                    shadowColor: '#3D39890D',
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.18,
                    shadowRadius: 1.0,

                    elevation: 1,
                  },
                  pinCodeContainerStyle: {
                    width: 58,
                    backgroundColor: 'trancsparent',
                    borderRadius: moderateScale(8),
                    borderColor: `#FFFFFF14`,
                  },
                  pinCodeTextStyle: {
                    color: '#FFFFFF',
                  },
                }}
              />

              <TouchableOpacity
                style={styles.bottomContainer}
                onPress={handleVerify}>
                <AppButton
                  btnText={'Done'}
                  btnStyle={[styles.button]}
                  btnTextStyle={styles.buttonText}
                  onPress={handleVerify}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (route?.params?.backScreenName == 'Login') {
                    sendOtp();
                  } else {
                    const payload = {
                      email: route.params.email,
                    };
                    forgetPasswordOtpMutation.mutate(payload);
                  }
                }}>
                <Text
                  style={{
                    fontWeight: '300',
                    fontSize: moderateScale(14),
                    color: APP_COLORS.WHITE,
                    marginTop: moderateScale(24),
                    textAlign: 'center',
                  }}>
                  OTP not Received?{' '}
                  <Text style={{color: '#D9C3FF'}}>Send Again</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  container: {flex: 1, marginHorizontal: moderateScale(24)},
  scroll: {flexGrow: 1, alignItems: 'center', marginTop: moderateScale(16)},
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  formBackground: {
    padding: moderateScale(22),
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: APP_COLORS.BORDER_COLOR,
    borderRadius: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '60%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 20,
    marginBottom: 24,
    backgroundColor: '#f9f9f9',
    letterSpacing: 10,
  },

  resendButton: {
    marginTop: 8,
  },
  resendText: {
    color: '#4F8EF7',
    fontSize: 16,
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
});

export default OtpVerification;
