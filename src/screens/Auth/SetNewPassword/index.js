import {postRequest} from '@api/apiService';
import {APIS} from '@api/apiSheet';
import {Images} from '@assets/index';
import AppButton from '@components/AppButton';
import AppImage from '@components/AppImage';
import AppText from '@components/AppText';
import {APP_COLORS} from '@constants/color';
import {useRoute} from '@react-navigation/native';
import {useMutation} from '@tanstack/react-query';
import React, {useState} from 'react';
import {
  Alert,
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

const SetNewPassword = ({navigation}) => {
  const route = useRoute();
  console.log('routeroute><><><><>><<', route);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const mutation = useMutation({
    mutationFn: payload => postRequest(APIS.RESET_PASSWORD_OTP, payload),
    onSuccess: data => {
      console.log('User password reset:', data);

      if (data?.success) {
        showSuccess('success', data?.message);
        navigation.navigate('Login');
      } else {
        showError('Error', data?.message);
      }
    },
    onError: error => {
      console.error('Error login user:', error);
      showError('Success', error?.message);
    },
  });

  const handleSubmit = () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password) {
      showError('Error', 'Password cannot be empty.');
      return false;
    }

    if (!passwordRegex.test(password)) {
      showError(
        'Error',
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.',
      );
      return false;
    }

    if (password !== confirmPassword) {
      showError('Error', 'Passwords do not match.');
      return false;
    }

    let payload = {
      email: route?.params?.email,
      password: password,
      confirmPassword: confirmPassword,
    };
    mutation.mutate(payload);
  };

  return (
    <ImageBackground source={Images.background} style={styles.background}>
      <SafeAreaView style={styles.container}>
        {/* header */}
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

        {/* Form */}
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* <ImageBackground
            source={Images.formBackground}
            style={styles.formBackground}> */}
          <View style={styles.formBackground}>
            <AppText
              style={{
                color: APP_COLORS.WHITE,
                fontWeight: '400',
                fontSize: moderateScale(20),
                textAlign: 'center',
              }}>
              Create New Password
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
                  source={Images.lock}
                  style={{
                    width: moderateScale(18),
                    height: moderateScale(18),
                    marginRight: moderateScale(8),
                  }}
                />
                <TextInput
                  placeholder="Enter your New Password"
                  placeholderTextColor={APP_COLORS.PLACEHOLDER_TEXT_COLOR}
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                  style={styles.inputText}
                />
              </View>
              <View style={{marginTop: moderateScale(16)}} />
              <View style={styles.input}>
                <AppImage
                  source={Images.lock}
                  style={{
                    width: moderateScale(18),
                    height: moderateScale(18),
                    marginRight: moderateScale(8),
                  }}
                />
                <TextInput
                  placeholder="Confirm your New Password"
                  placeholderTextColor={APP_COLORS.PLACEHOLDER_TEXT_COLOR}
                  autoCapitalize="none"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
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
          {/* </ImageBackground> */}
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
    color: 'white',
  },
});

export default SetNewPassword;
