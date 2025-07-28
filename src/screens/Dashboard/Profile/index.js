import {Images} from '@assets/index';
import AppImage from '@components/AppImage';
import AppText from '@components/AppText';
import {APP_COLORS} from '@constants/color';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';
import {moderateScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {showError, showSuccess} from 'utils/alerts';
import {styles} from './styles';
//  import DatePicker from 'react-native-date-picker';
import {getRequest, postRequest} from '@api/apiService';
import {useMutation, useQuery} from '@tanstack/react-query';
import {APIS} from '@api/apiSheet';

export default function Profile() {
  const userData = useSelector(state => state?.auth?.userLoginData?.userData);
  const navigation = useNavigation();
  const {isPending, error, data} = useQuery({
    queryKey: ['getUserProfileData'],
    queryFn: () =>
      getRequest(`${APIS.GET_USER_PROFILE_DATA}?userId=${userData?._id}`),
  });

  const postUserProfileData = useMutation({
    mutationFn: payload => postRequest(APIS.POST_USER_PROFILE_DATA, payload),
    onSuccess: data => {
      console.log('send questiner response:', data);
      if (data?.success) {
        // onClose();
        showSuccess('Success', data?.message);
        // navigation.reset({
        //   index: 1,
        //   routes: [{name: 'DrawerStack', params: {screen: 'MyProfile'}}],
        // });
      } else {
        showError('Error', data?.message);
      }
    },
    onError: error => {
      console.error('Error log api', error);
    },
  });

  useEffect(() => {
    const user = data?.data;

    setFormData(prev => ({
      ...prev,
      fullName: user?.fullName || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
      role: user?.role || 'Patient',
      userId: user?._id || '',
      address: user?.address || '',
      gender: user?.gender || '',
    }));
  }, [data]);

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    email: '',
    mobile: '',
    gender: '',
    dob: '',
    role: 'Patient',

    bloodGroup: '',

    // profile_pic: '',
    userId: userData?._id,
  });
  const [open, setOpen] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const handleChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  const formatDateToDDMMYYYY = date => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const validateForm = () => {
    const {fullName, email, mobile, dob, gender, address} = formData;

    if (!fullName) {
      showError('Error', 'Enter a full name');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      showError('Error', 'Enter a valid email');
      return false;
    }

    // basic phone number check
    if (mobile.length < 10) {
      showError('Error', 'Enter a valid contact number');
      return false;
    }
    if (!formData.bloodGroup) {
      showError('Error', 'Please enter your blood group');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Final Payload:', formData);
      postUserProfileData.mutate(formData);
    }
  };

  const BackButton = () => {
    return (
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
    );
  };

  return (
    <ImageBackground source={Images.Homebackground} style={styles.background}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.container}>
          <View style={{flexDirection: 'row', gap: 100}}>
            <BackButton />

            <Text
              style={{
                color: '#ffff',
                alignSelf: 'center',
                fontWeight: 400,
                fontSize: 16,
                lineHeight: 28,
              }}>
              My Profile
            </Text>
          </View>

          <ScrollView
            contentContainerStyle={[styles.scroll, {paddingBottom: 40}]}
            showsVerticalScrollIndicator={false}>
            <ImageBackground
              source={Images.myprofileFormBg}
              style={styles.formBackground}>
              <AppText
                style={{
                  fontSize: 20,
                  fontWeight: '400',
                  lineHeight: 28,
                  color: '#ffff',
                  textAlign: 'center',
                  marginTop: moderateScale(23),
                  marginBottom: moderateScale(8),
                }}>
                Update Profile
              </AppText>
              <AppText
                style={{
                  fontSize: 14,
                  fontWeight: '300',
                  lineHeight: 20,
                  color: '#F4F3F3',
                  textAlign: 'center',
                }}>
                Just a few details to help us tailor your sleep experience.
              </AppText>
              <View
                style={{
                  alignItems: 'center',
                  marginTop: moderateScale(22),
                  marginBottom: moderateScale(16),
                }}>
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

              <View>
                {/* full name */}
                <View style={styles.input}>
                  <AppImage
                    source={Images.profileImage}
                    style={styles.inputIconTextbox}
                  />
                  <TextInput
                    placeholder={'Full Name'}
                    placeholderTextColor={APP_COLORS.PLACEHOLDER_TEXT_COLOR}
                    value={formData.fullName}
                    onChangeText={text => handleChange('fullName', text)}
                    style={styles.inputText}
                  />
                </View>
                {/* Email */}
                <View style={styles.input}>
                  <AppImage
                    source={Images.email}
                    style={styles.inputIconTextbox}
                  />
                  <TextInput
                    placeholder={'Email'}
                    placeholderTextColor={APP_COLORS.PLACEHOLDER_TEXT_COLOR}
                    value={formData.email}
                    onChangeText={text => handleChange('email', text)}
                    style={styles.inputText}
                    keyboardType="email-address"
                    editable={false}
                  />
                </View>
                {/* Phone */}
                <View style={styles.input}>
                  <AppImage
                    source={Images.phone}
                    style={styles.inputIconTextbox}
                  />
                  <TextInput
                    placeholder={'Contact Number'}
                    placeholderTextColor={APP_COLORS.PLACEHOLDER_TEXT_COLOR}
                    value={formData.mobile}
                    onChangeText={text => handleChange('mobile', text)}
                    keyboardType="numeric"
                    style={styles.inputText}
                  />
                </View>
                {/* calender */}
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setOpen(true)}>
                  <AppImage
                    source={Images.calender}
                    style={styles.inputIconTextbox}
                  />
                  <TextInput
                    placeholder="DOB (DD/MM/YYYY)"
                    placeholderTextColor={APP_COLORS.PLACEHOLDER_TEXT_COLOR}
                    value={formData.dob}
                    onChangeText={text => handleChange('dob', text)}
                    style={styles.inputText}
                    editable={false}
                  />
                  {/* <DatePicker
                    modal
                    mode="date"
                    open={open}
                    date={tempDate}
                    maximumDate={new Date()}
                    onConfirm={date => {
                      setOpen(false);
                      const formattedDOB = formatDateToDDMMYYYY(date);
                      handleChange('dob', formattedDOB);
                      setTempDate(date);
                    }}
                    onCancel={() => setOpen(false)}
                  /> */}
                </TouchableOpacity>
                {/* gender */}
                <View style={styles.input}>
                  <AppImage
                    source={Images.calender}
                    style={styles.inputIconTextbox}
                  />
                  <TextInput
                    placeholder="Gender (Male/Female/Others)"
                    placeholderTextColor={APP_COLORS.PLACEHOLDER_TEXT_COLOR}
                    value={formData.gender}
                    onChangeText={text => handleChange('gender', text)}
                    style={styles.inputText}
                  />
                </View>
                {/* Blood group */}
                <View style={styles.input}>
                  <AppImage
                    source={Images.calender}
                    style={styles.inputIconTextbox}
                  />
                  <TextInput
                    placeholder={'Blood Group'}
                    placeholderTextColor={APP_COLORS.PLACEHOLDER_TEXT_COLOR}
                    value={formData.bloodGroup}
                    onChangeText={text => handleChange('bloodGroup', text)}
                    style={styles.inputText}
                  />
                </View>
                {/* Address */}
                <View style={styles.input}>
                  <AppImage
                    source={Images.home}
                    style={styles.inputIconTextbox}
                  />
                  <TextInput
                    placeholder={'Location'}
                    placeholderTextColor={APP_COLORS.PLACEHOLDER_TEXT_COLOR}
                    value={formData.address}
                    onChangeText={text => handleChange('address', text)}
                    style={styles.inputText}
                  />
                </View>
              </View>
              <View style={styles.navigationContainer}>
                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                  <Text style={styles.buttonText}>Update profile</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
