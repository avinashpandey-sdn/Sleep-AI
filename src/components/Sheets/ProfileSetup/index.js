import {postRequest} from '@api/apiService';
import {APIS} from '@api/apiSheet';
import {Images} from '@assets/index';
import AppImage from '@components/AppImage';
import AppText from '@components/AppText';
import {APP_COLORS} from '@constants/color';
import React, {useState} from 'react';
import {showError} from 'utils/alerts';
import {
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {moderateScale} from 'react-native-size-matters';

const ProfileSetupSheet = ({sheetRef, item = {}, onClose}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const currentQuestion = {
    options: [
      {
        _id: '1',
        placeholder: 'Full Name',
        image: Images.profileImage,
        value: '',
      },
      {
        _id: '2',
        placeholder: 'Enter your Email',
        image: Images.email,
        value: '',
      },
      {
        _id: '3',
        placeholder: 'Enter your Phone Number',
        image: Images.phone,
        value: '',
      },
      {
        _id: '4',
        placeholder: 'Enter your Full Address',
        image: Images.home,
        value: '',
      },
    ],
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };
  const handleAnswerChange = (key, value) => {
    setAnswers(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateForm = () => {
    if (!answers.name.trim()) {
      showError('Error', 'Full name is required.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!answers.email.trim()) {
      showError('Error', 'Email is required.');
      return false;
    }
    if (!emailRegex.test(answers.email)) {
      showError('Error', 'Enter a valid email.');
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!answers.phone.trim()) {
      showError('Error', 'Phone number is required.');
      return false;
    }
    if (!phoneRegex.test(answers.phone)) {
      showError('Error', 'Enter a valid 10-digit phone number.');
      return false;
    }

    if (!answers.address.trim()) {
      showError('Error', 'Password is required.');
      return false;
    }
    if (answers.address.length < 0) {
      showError('Error', 'Password must be at least 6 characters long.');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const payload = {
      fullName: answers.name,
      email: answers.email,
      mobile: answers.phone,
      password: answers.address,
    };

    try {
      const response = await postRequest(APIS.REGISTER, payload);
      Alert.alert('Success', response?.message || 'Registered successfully!');
      onClose();
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', error?.message || 'Something went wrong.');
    }
  };

  const renderInput = () => {
    return (
      <View>
        {currentQuestion.options.map((option, index) => (
          <View key={option._id} style={styles.input}>
            <AppImage source={option.image} style={styles.inputIconTextbox} />
            <TextInput
              placeholder={option.placeholder}
              placeholderTextColor={APP_COLORS.PLACEHOLDER_TEXT_COLOR}
              value={answers[option._id] || ''}
              onChangeText={text => handleAnswerChange(option._id, text)}
              style={styles.inputText}
            />
          </View>
        ))}
      </View>
    );
  };

  const ProgressHeader = ({current = 1, total = 12, onSkip}) => {
    return (
      <View style={styles.progressHeaderContainer}>
        <TouchableOpacity onPress={onSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ActionSheet ref={sheetRef} containerStyle={styles.actionContainer}>
      <ImageBackground source={Images.background} style={styles.container}>
        <ProgressHeader current={1} total={12} onSkip={() => onClose()} />
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.formBackground}>
            <AppText
              style={{
                fontSize: moderateScale(20),
                fontWeight: 400,
                lineHeight: moderateScale(28),
                color: APP_COLORS.WHITE,
                textAlign: 'center',
              }}>
              Let's Set Up Your Profile
            </AppText>
            <AppText
              style={{
                fontSize: moderateScale(14),
                fontWeight: 300,
                lineHeight: moderateScale(20),
                color: APP_COLORS.TEXT_COLOR,
                textAlign: 'center',
                marginTop: moderateScale(8),
              }}>
              Just a few details to help us tailor your sleep experience.
            </AppText>
            <View style={{alignItems: 'center'}}>
              <View style={styles.profileCircle}>
                <AppImage
                  source={Images.imageUploadCircle}
                  style={styles.profileCircle}
                />
                <TouchableOpacity style={styles.uploadIcon}>
                  <AppImage
                    source={Images.uploadIcon}
                    style={styles.uploadIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {renderInput()}
            <View style={styles.navigationContainer}>
              <TouchableOpacity onPress={handleSave} style={styles.button}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={{marginTop: moderateScale(30)}}>
              <Text
                style={[styles.skipText, {alignSelf: 'center', margin: 10}]}>
                Skip
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  actionContainer: {backgroundColor: 'black', height: '100%'},
  background: {},
  container: {
    height: '100%',
  },
  progressHeaderContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    backgroundColor: 'transparent',
  },
  pageText: {
    color: APP_COLORS.WHITE,
    marginLeft: 10,
    marginRight: 'auto',
  },
  skipText: {
    color: APP_COLORS.WHITE,
    fontSize: 16,
    textAlign: 'right',
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    marginTop: moderateScale(15),
    // marginTop: moderateScale(42),
  },
  formBackground: {
    width: moderateScale(327),
    padding: moderateScale(22),
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: APP_COLORS.BORDER_COLOR,
    borderRadius: 40,
  },
  inputIcon: {
    width: moderateScale(127),
    height: moderateScale(127),
  },
  questnerHeading: {
    fontSize: 20,
    fontWeight: '400',
    color: APP_COLORS.WHITE,
    textAlign: 'center',
    marginBottom: moderateScale(28),
  },
  button: {
    backgroundColor: '#6832C4',
    borderRadius: APP_COLORS.BORDER_COLOR,
    borderRadius: 100,
    height: moderateScale(50),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#AB9BDD',
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  buttonText: {
    fontWeight: '400',
    fontSize: 14,
    color: APP_COLORS.WHITE,
  },
  navigationContainer: {
    marginTop: moderateScale(10),
    flexDirection: 'row',
  },

  input: {
    borderWidth: 1,
    borderColor: APP_COLORS.TEXT_INPUT_BORDER_COLOR,
    borderRadius: 100,
    alignItems: 'center',
    flexDirection: 'row',
    height: moderateScale(50),
    paddingLeft: moderateScale(18),
    backgroundColor: '#FFFFFF0A',
    color: 'white',
    marginBottom: 20,
    gap: 10,
  },
  inputIconTextbox: {
    width: moderateScale(18),
    height: moderateScale(18),
  },
  profileCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    position: 'relative', // Needed for absolute positioning of the icon
  },
  uploadIcon: {
    width: 32,
    height: 32,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  inputText: {
    fontSize: 14,
    fontWeight: 300,
    color: '#FFFFFF',
  },
});

export default ProfileSetupSheet;
