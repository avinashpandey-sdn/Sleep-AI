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
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {showError, showSuccess} from 'utils/alerts';
import styles from './style';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
export default function Signup({navigation}) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    termsAccepted: false,
  });
  const [registerFrom, setRegisterFrom] = useState('manual');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleChange = (key, value) => {
    setForm({...form, [key]: value});
  };

  const validateForm = () => {
    if (!form.firstName.trim()) {
      showError('Error', 'First name is required.');
      return false;
    }
    if (!form.lastName.trim()) {
      showError('Error', 'Last name is required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      showError('Error', 'Email is required.');
      return false;
    }
    if (!emailRegex.test(form.email)) {
      showError('Error', 'Enter a valid email.');
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!form.phone.trim()) {
      showError('Error', 'Phone number is required.');
      return false;
    }
    if (!phoneRegex.test(form.phone)) {
      showError('Error', 'Enter a valid 10-digit phone number.');
      return false;
    }

    if (!form.password.trim()) {
      showError('Error', 'Password is required.');
      return false;
    }
    if (form.password.length < 6) {
      showError('Error', 'Password must be at least 6 characters long.');
      return false;
    }
    if (!form.termsAccepted) {
      showError('Error', 'You must accept the terms and conditions.');
      return false;
    }

    return true;
  };
  const openURL = async () => {
    const url = 'https://www.termsfeed.com/blog/terms-conditions-url';
    await Linking.openURL(url);
  };

  const signUpMutation = useMutation({
    mutationFn: payload => postRequest(APIS.REGISTER, payload),
    onSuccess: data => {
      console.log('User registered successfully:', data);
      if (!data.success === false) {
        showSuccess('Success', data?.message);
        navigation.navigate('Login');
      } else {
        showError('Success', data?.message);
      }
    },
    onError: error => {
      console.error('Error registering user:', error);
      showError('Success', error?.message);
    },
  });

  const handleSignup = async () => {
    if (await validateForm()) {
      let payload = {
        firstName: form?.firstName,
        lastName: form?.lastName,
        email: form?.email,
        mobile: form?.phone,
        password: form?.password,
        role: 'Patient', //Patient//Provider
        registerFrom: registerFrom, //"manual", "google", "apple",
      };
      signUpMutation.mutate(payload);
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
      <KeyboardAwareScrollView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.container}>
          <BackButton />

          <ScrollView
            contentContainerStyle={styles.scroll}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View style={styles.formBackground}>
              <AppText style={styles.heading}>Sign Up</AppText>
              <AppText style={styles.subHeading}>
                We are happy to see you. Enter your mentioned below full
                details.
              </AppText>

              {/* form */}
              <View>
                <View style={{marginTop: moderateScale(22)}} />
                <View style={styles.input}>
                  <AppImage
                    source={Images.profileImage}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="First Name"
                    placeholderTextColor={APP_COLORS.PLACEHOLDER_TEXT_COLOR}
                    value={form.firstName}
                    onChangeText={text => handleChange('firstName', text)}
                    style={styles.inputText}
                  />
                </View>
                <View style={{marginTop: moderateScale(22)}} />
                <View style={styles.input}>
                  <AppImage
                    source={Images.profileImage}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Last Name"
                    placeholderTextColor={APP_COLORS.PLACEHOLDER_TEXT_COLOR}
                    value={form.lastName}
                    onChangeText={text => handleChange('lastName', text)}
                    style={styles.inputText}
                  />
                </View>
                <View style={{marginTop: moderateScale(16)}} />
                <View style={styles.input}>
                  <AppImage source={Images.email} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Enter your Email"
                    placeholderTextColor={APP_COLORS.PLACEHOLDER_TEXT_COLOR}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={form.email}
                    onChangeText={text => handleChange('email', text)}
                    style={styles.inputText}
                  />
                </View>

                <View style={{marginTop: moderateScale(16)}} />
                <View style={styles.input}>
                  <AppImage source={Images.phone} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Enter your Phone Number"
                    placeholderTextColor={APP_COLORS.PLACEHOLDER_TEXT_COLOR}
                    keyboardType="phone-pad"
                    value={form.phone}
                    onChangeText={text => handleChange('phone', text)}
                    style={styles.inputText}
                    maxLength={10}
                  />
                </View>
                <View style={{marginTop: moderateScale(16)}} />
                <View style={styles.input}>
                  <AppImage source={Images.lock} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Enter your Password"
                    placeholderTextColor={APP_COLORS.PLACEHOLDER_TEXT_COLOR}
                    secureTextEntry={secureTextEntry}
                    value={form.password}
                    onChangeText={text => handleChange('password', text)}
                    style={styles.inputText}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setSecureTextEntry(!secureTextEntry);
                    }}>
                    <AppImage
                      source={
                        secureTextEntry ? Images.closeEye : Images.openEye
                      }
                      style={styles.inputIcon}
                    />
                  </TouchableOpacity>
                </View>

                <View
                  style={{flexDirection: 'row', marginTop: moderateScale(16)}}>
                  <TouchableOpacity
                    onPress={() =>
                      handleChange('termsAccepted', !form.termsAccepted)
                    }
                    style={[
                      styles.checkBox,
                      {
                        backgroundColor: form.termsAccepted
                          ? '#8B71DB'
                          : 'transparent',
                      },
                    ]}>
                    <AppImage source={Images.right} style={styles.rightIcon} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={openURL}>
                    <Text
                      style={{
                        fontWeight: '400',
                        fontSize: moderateScale(12),
                        color: APP_COLORS.WHITE,
                      }}>
                      I agree with{' '}
                      <Text
                        style={{
                          color: '#D9C3FF',
                          textDecorationLine: 'underline',
                        }}>
                        Terms of service & Privacy Policy
                      </Text>
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.bottomContainer}
                  onPress={handleSignup}
                  disabled={!form.termsAccepted}>
                  <AppButton
                    btnText={'Sign Up'}
                    btnStyle={[
                      styles.button,
                      !form.termsAccepted && {backgroundColor: 'transparent'},
                    ]}
                    btnTextStyle={styles.buttonText}
                    onPress={handleSignup}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.textStyle}>
                    Have an account?{' '}
                    <Text style={{color: '#D9C3FF'}}>Sign In</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
}
