import {postRequest} from '@api/apiService';
import {APIS} from '@api/apiSheet';
import {setLoguserId, setUserLoginData} from '@app/reducers/auth/auth.slice';
import {Images} from '@assets/index';
import AppButton from '@components/AppButton';
import AppImage from '@components/AppImage';
import AppText from '@components/AppText';
import {APP_COLORS} from '@constants/color';
import appleAuth from '@invertase/react-native-apple-authentication';
import messaging from '@react-native-firebase/messaging';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useMutation} from '@tanstack/react-query';
import jwt_decode from 'jwt-decode';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {useDispatch} from 'react-redux';
import {showError, showSuccess} from 'utils/alerts';
import styles from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState(__DEV__ ? 'kalu51@yopmail.com' : '');
  const [password, setPassword] = useState(__DEV__ ? 'Admin@123' : '');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const dispatch = useDispatch();
  const webClientId =
    '143174552645-inub1on5v4182tvf83h6bp1l19o7eqbt.apps.googleusercontent.com';
  const iosClientId =
    '143174552645-am3r97gn517u2adrgkssad1dfn09t1ov.apps.googleusercontent.com';

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: webClientId,
      iosClientId: iosClientId,
    });
  }, []);

  const postLogApi = useMutation({
    mutationFn: payload => postRequest(APIS.LOGAPI, payload),
    onSuccess: data => {
      console.log('log api called suuces:', data?.data?._id);
      if (data?.data?._id) {
        dispatch(setLoguserId(data?.data?._id));
      }
    },
    onError: error => {
      console.error('Error log api', error);
    },
  });

 const {
  mutate: loginUser,
  isPending,
} = useMutation({
    mutationFn: payload => postRequest(APIS.LOGIN, payload),
    onSuccess: data => {
      console.log('loginMutation successfully:', data);

      if (data?.success) {
        {
          /** If Otp not verified (First time login) */
        }
        if (!data?.data?.userData?.verified) {
          navigation.navigate('OtpVerification', {
            backScreenName: 'Login',
            email: email,
            userId: data?.data?.userData?._id,
          });
        } else {
          showError('Error', data?.message);
          navigation.navigate('DashbordStack');
          showSuccess('Success', data?.message);
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
          // log Api called
        }
      } else {
        console.log('error>>>', error);
        showError('Error', data?.message);
      }
    },
    onError: error => {
      showError('Success', error?.message);
    },
  });
  const mutation_google = useMutation({
    mutationFn: payload => postRequest(APIS.SOCIAL_LOGIN, payload),
    onSuccess: data => {
      console.log('mutation_google successfully:', data);

      if (data?.success) {
        if (!data?.data?.userData?.verified) {
          navigation.navigate('OtpVerification', {
            backScreenName: 'Login',
            email: data?.data?.userData?.email,
            userId: data?.data?.userData?._id,
          });
        } else {
          showError('Error', data?.message);
          navigation.navigate('DashbordStack');
          showSuccess('Success', data?.message);
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
        }
      } else {
        console.log('error>>>', error);
        showError('Error', data?.message);
      }
    },
    onError: error => {
      showError('Success', error?.message);
    },
  });

  const mutation_apple = useMutation({
    mutationFn: payload => postRequest(APIS.SOCIAL_LOGIN_APPLE, payload),
    onSuccess: data => {
      console.log('mutation_apple successfully:', data);
      if (data?.success) {
        if (!data?.data?.userData?.verified) {
          navigation.navigate('OtpVerification', {
            backScreenName: 'Login',
            email: email,
            userId: data?.data?.userData?._id,
          });
        } else {
          showError('Error', data?.message);
          navigation.navigate('DashbordStack');
          showSuccess('Success', data?.message);
          dispatch(setUserLoginData(data?.data));
          let payload = {
            action: 'Login',
            user: {
              email: data?.data?.userData?.email,
              fullName: data?.data?.userData?.fullName,
              role: 'Patient',
              userId: data?.data?.userData?._id,
            },
          };
          postLogApi.mutate(payload);
        }
      } else {
        console.log('error>>>', error);
        showError('Error', data?.message);
      }
    },
    onError: error => {
      showError('Success', error?.message);
    },
  });
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
    if (!password.trim()) {
      showError('Error', 'Password is required.');
      return false;
    }
    if (password.length < 6) {
      showError('Error', 'Password must be at least 6 characters long.');
      return false;
    }

    return true;
  };
  const handleSignin = async () => {
    if (validateForm()) {
      let payload = {
        email: email,
        password: password,
        role: 'Patient',
      };
      console.log('payload><><<', payload);
      // loginMutation.mutate(payload);
      loginUser(payload);

    }
  };

  const handleGoogleLogin = async () => {
      if (isGoogleLoading) return;

    try {
      setIsGoogleLoading(true);
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const userInfo = await GoogleSignin.signIn();
      const {idToken} = await GoogleSignin.getTokens();
      await messaging().registerDeviceForRemoteMessages();
      const fcmToken = await messaging().getToken();

      const payload = {
        token: idToken,
        fcmToken: fcmToken,
        role: 'Patient',
        registerFrom: 'google',
      };
       mutation_google.mutate(payload, {
      onSettled: () => setIsGoogleLoading(false),
    });
      // Log for debug
      console.log('Google Sign-In userInfo:', userInfo);
      console.log('Google ID Token:', idToken);
      console.log('FCM Token:', fcmToken);
    } catch (error) {
          setIsGoogleLoading(false);
          console.error('Google login error:', error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        showError('Cancelled', 'User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        showError('In Progress', 'Google login already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        showError('Error', 'Google Play Services not available or outdated');
      } else {
        showError('Error', error.message || 'Something went wrong');
      }
    }
  };
  const handleAppleLogin = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      const {user, identityToken} = appleAuthRequestResponse;

      if (!identityToken) {
        showError('Apple Sign-In failed', 'No identity token returned');
        return;
      }

      const decoded = jwt_decode(identityToken);
      const email = decoded?.email || `${user}@apple.com`;
      const payload = {
        identityToken: identityToken,
        fcmToken:
          'fRLWnC0RR3aB6LfiGdJQtM:APA91bFPFh4jQuY2BLjMrjNzaZkN5HZx0MXJQ9OLIk45clquWS2OW51tP9qjywXM671DgVmf9OOuzVPCpACBYZ25ZFDB6tByObCJbfx4-cFAFjQ5BzaJ9Sw', // ✅ Use the actual device FCM token
        email,
        role: 'Patient',
        registerFrom: 'apple',
      };

      console.log('appleAuthRequestResponse', appleAuthRequestResponse);

      mutation_apple.mutate(payload);
    } catch (error) {
      console.error('Apple Sign-In Error:', error);
      showError('Apple Sign-In failed', error?.message || '');
    }
  };
  const BackButton = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          paddingTop: Platform.OS == 'android' && moderateScale(16),
          opacity: navigation.canGoBack() ? 1 : 0,
          pointerEvents: navigation.canGoBack() ? 'auto' : 'none',
          marginLeft: 20,
          marginLeft: 20,
        }}>
        <AppImage
          source={Images.back}
          style={{width: moderateScale(30), height: moderateScale(30)}}
        />
      </TouchableOpacity>
    );
  };
  return (
    <ImageBackground source={Images.background} style={styles.background}>
      <StatusBar barStyle="light-content" backgroundColor={'black'} />

      <SafeAreaView style={styles.container}>
        <BackButton />
        <KeyboardAwareScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.formBackground}>
            <AppText style={styles.heading}>login</AppText>
            <AppText style={styles.subHeading}>
              We are happy to see you again. Enter your email address and
              password
            </AppText>

            <View>
              <View style={{marginTop: moderateScale(16)}} />
              <View style={styles.input}>
                <AppImage source={Images.email} style={styles.inputIcon} />
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

              <View style={{marginTop: moderateScale(16)}} />
              <View style={styles.input}>
                <AppImage source={Images.lock} style={styles.inputIcon} />
                <TextInput
                  placeholder="Enter your Password"
                  placeholderTextColor={APP_COLORS.PLACEHOLDER_TEXT_COLOR}
                  secureTextEntry={secureTextEntry}
                  onChangeText={setPassword}
                  style={styles.inputText}
                  value={password}
                />
                <TouchableOpacity
                  onPress={() => {
                    setSecureTextEntry(!secureTextEntry);
                  }}>
                  <AppImage
                    source={secureTextEntry ? Images.closeEye : Images.openEye}
                    style={styles.inputIcon}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.forgotButton}
                onPress={() => navigation.navigate('ForgotPasswordScreen')}>
                <Text style={styles.forgotButtonText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                 style={[styles.bottomContainer, isPending && { opacity: 0.7 }]}
                 onPress={handleSignin}
                  disabled={isPending}
                
                >
                <AppButton
                  btnText={isPending ? '' : 'Log In'}                  
                  btnStyle={[styles.button]}
                  btnTextStyle={styles.buttonText}
                  onPress={handleSignin}
                  disabled={isPending}

                />
                 {isPending && (
                    <ActivityIndicator
                      size="small"
                      color="#fff"
                      style={{ position: 'absolute', alignSelf: 'center',top:16 }}
                    />
                  )}
              </TouchableOpacity>

              <View style={styles.orContainer}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>Or</Text>
                <View style={styles.orLine} />
              </View>

              <View style={styles.socialLoginContainer}>
                <TouchableOpacity onPress={handleGoogleLogin} disabled={isGoogleLoading} >
                  {isGoogleLoading ? (
                    <ActivityIndicator color="#fff"  size="small" style={{  alignSelf: 'center',marginTop:20 }}/>
                  ) : (
                    <AppImage source={Images.google} style={styles.socialIcon} />
                  )}
                </TouchableOpacity>

                {Platform.OS === 'ios' && (
                  <>
                    <View style={{marginRight: 20}} />
                    <TouchableOpacity onPress={handleAppleLogin}>
                      <AppImage
                        source={Images.apple}
                        style={styles.socialIcon}
                      />
                    </TouchableOpacity>
                  </>
                )}
              </View>

              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.haveAccountText}>
                  Have an account?{' '}
                  <Text style={{color: '#D9C3FF'}}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
