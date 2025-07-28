import {Images} from '@assets/index';
import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {getRequest} from '@api/apiService';
import {APIS} from '@api/apiSheet';
import AppImage from '@components/AppImage';
import {APP_COLORS} from '@constants/color';
import {useNavigation} from '@react-navigation/native';
import {useMutation, useQuery} from '@tanstack/react-query';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';
import {moderateScale} from 'react-native-size-matters';

const mapApiDataToMyStructure = apiData => {
  const mappedData = {
    options: [
      {
        _id: '1',
        label: 'Full Name',
        value: apiData?.fullName || '',
      },
      {
        _id: '2',
        label: 'Email',
        value: apiData?.email || '',
      },
      {
        _id: '3',
        label: 'Phone Number',
        value: apiData?.mobile || '',
      },
      {
        _id: '4',
        label: 'Date of Birth',
        value: apiData?.dob || '', // Assuming dob may come in future
      },
      {
        _id: '5',
        label: 'Gender',
        value: apiData?.gender || '', // Assuming gender may come in future
      },
      {
        _id: '6',
        label: 'Blood Group',
        value: apiData?.bloodGroup || '', // Assuming bloodGroup may come in future
      },
      {
        _id: '7',
        label: 'Location',
        value: apiData?.address || '', // Assuming address may come in future
      },
    ],
  };

  return mappedData;
};
export default function MyProfile() {
  const screenOneData = useSelector(state => state);
  const userData = useSelector(state => state?.auth?.userLoginData?.userData);
  const navigation = useNavigation();
  const [currentQuestion, setCurrentQuestion] = useState([]);

  const {isPending, error, data} = useQuery({
    queryKey: ['getUserProfileData'],
    queryFn: () =>
      getRequest(`${APIS.GET_USER_PROFILE_DATA}?userId=${userData?._id}`),
  });

  useEffect(() => {
    const myStructuredData = mapApiDataToMyStructure(data?.data);
    setCurrentQuestion(myStructuredData);
  }, [data]);

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
  const renderInput = () => {
    return (
      <View>
        {currentQuestion?.options?.map((option, index) => (
          <View key={option._id} style={{marginBottom: 30}}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '400',
                marginVertical: 3,
                color: APP_COLORS.PLACEHOLDER_TEXT_COLOR,
              }}>
              {option.label}
            </Text>
            <Text
              style={{
                borderRadius: 8,
                padding: 2,
                color: APP_COLORS.WHITE,
                fontSize: 16,
                fontWeight: '400',
              }}>
              {option.value}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const handleSave = async () => {
    navigation.navigate('Profile');
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
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}>
            <ImageBackground
              source={Images.myprofileFormBg}
              // source={Images.editProfile}
              style={styles.formBackground}>
              <View
                style={{
                  alignItems: 'center',
                  position: 'relative',
                  bottom: moderateScale(45),
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
              {renderInput()}
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  // marginTop:
                  //   Platform.OS === 'ios'
                  //     ? moderateScale(40)
                  //     : moderateScale(30),
                  alignSelf: 'center',
                }}>
                {Array.from({length: 38}).map((_, index) => (
                  <View
                    key={index}
                    style={{
                      width: 2,
                      height: 1,
                      backgroundColor: '#FFFFFF',
                      marginHorizontal: 3,
                    }}
                  />
                ))}
              </View>

              <View style={styles.navigationContainer}>
                <TouchableOpacity onPress={handleSave} style={styles.button}>
                  <Text style={styles.buttonText}>Edit profile</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: moderateScale(18),
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    marginTop: moderateScale(16),
  },
  formBackground: {
    width: moderateScale(336),
    height: moderateScale(800),
    paddingHorizontal: moderateScale(22),
    margin: moderateScale(50),
    resizeMode: 'contain',
  },

  button: {
    backgroundColor: '#6832C4',
    borderWidth: 1,
    borderRadius: 100,
    height: moderateScale(54),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontWeight: '400',
    fontSize: 14,
    color: '#FFFFFF',
  },
  navigationContainer: {
    marginTop: moderateScale(20),
    flexDirection: 'row',
  },

  profileCircle: {
    width: 120,
    height: 120,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // margin: 20,
  },
  uploadIcon: {
    width: 32,
    height: 32,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
