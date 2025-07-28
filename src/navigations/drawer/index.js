import { Images } from '@assets/index';
import AppText from '@components/AppText';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import Profile from '@screens/Dashboard/Profile';
import MyProfile from '@screens/Dashboard/Profile/MyProfile';
import React, { useRef } from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import BottomTab from '../bottom';
import AppImage from '@components/AppImage';
import SubscriptionSheet from '@components/Sheets/Subscription/SubscriptionSheet';
import { useDispatch, useSelector } from 'react-redux';
import { setUserLoginData } from '@app/reducers/auth/auth.slice';
import { useMutation } from '@tanstack/react-query';
import { postRequest } from '@api/apiService';
import { APIS } from '@api/apiSheet';

const Drawer = createDrawerNavigator();

export default function DrawerStack() {
  const SubscriptionSheetRef = useRef();

  return (
    <>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: '74%',
          },
        }}
        drawerContent={props => (
          <CustomDrawerContent
            {...props}
            SubscriptionSheetRef={SubscriptionSheetRef}
          />
        )}>
        <Drawer.Screen name={'BottomTab'} component={BottomTab} />

        <Drawer.Screen name={'Profile'} component={Profile} />
        <Drawer.Screen name={' MyProfile'} component={MyProfile} />
      </Drawer.Navigator>
      <SubscriptionSheet
        sheetRef={SubscriptionSheetRef}
        onClose={() => SubscriptionSheetRef.current?.hide()}
      />
    </>
  );
}

function CustomDrawerContent(props) {
  const navigation = useNavigation();
  const [selectedLabel, setSelectedLabel] = React.useState('');
  const { SubscriptionSheetRef } = props;
  const dispatch = useDispatch();
  const AuthData = useSelector(state => state.auth);
  const postLogApi = useMutation({
    mutationFn: payload => postRequest(APIS.LOGAPI, payload),
    onSuccess: data => {
      console.log('log api logout called', data);
    },
    onError: error => {
      console.error('Error log api', error);
    },
  });
  const logoutCalled = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'AuthStack', params: { screen: 'Login' } }],
    });
    dispatch(setUserLoginData({}));

    let payload = {
      logsId: AuthData?.userLogId,
    };
    postLogApi.mutate(payload);
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('DashbordStack', { screen: 'MyProfile' });
        }}>
        <ImageBackground
          source={Images.drawer_banner}
          style={styles.background}>
          <AppText
            style={{
              fontWeight: '500',
              fontSize: 16,
              color: '#fff',
              paddingHorizontal: 14,
              paddingTop: 10,
            }}>
            Jenny Wilson
          </AppText>
          <AppText
            style={{
              fontWeight: '300',
              fontSize: 12,
              color: '#FFFFFF',
              paddingHorizontal: 14,
            }}>
            jennyw@demo.com
          </AppText>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('DashbordStack', { screen: 'Profile' });
            }}
            style={{
              width: 111,
              height: 36,
              marginVertical: 20,
              marginHorizontal: 10,
            }}>
            <ImageBackground
              source={Images.drawer_button}
              style={{ alignItems: 'center', justifyContent: 'center' }}>
              <AppText
                style={{
                  fontWeight: '500',
                  fontSize: 16,
                  color: '#fff',
                  paddingHorizontal: 14,
                  marginVertical: 8,
                }}>
                Edit Profile
              </AppText>
            </ImageBackground>
          </TouchableOpacity>
        </ImageBackground>
      </TouchableOpacity>
      <View style={styles.menuSection}>
        {[
          {
            label: 'Subscription Plan',
            icon: Images.subscription_plan,
            navigationScreen: 'MySubscription',
            url: '',
          },

          {
            label: 'Settings',
            icon: Images.drawer_setting,
            navigationScreen: 'WebViewPage',
            url: 'https://meanstack.smartdatainc.com:9307/about',
          },
          {
            label: 'Connect Smartwatch',
            icon: Images.android_drawer,
            navigationScreen: 'WebViewPage',
            url: 'https://meanstack.smartdatainc.com:9307/about',
          },
          {
            label: 'Connect Sleep Mask',
            icon: Images.android_drawer,
            navigationScreen: 'WebViewPage',
            url: 'https://meanstack.smartdatainc.com:9307/about',
          },
          {
            label: 'Chat',
            icon: Images.chat_drawer,
            navigationScreen: 'WebViewPage',
            url: 'https://meanstack.smartdatainc.com:9307/about',
          },
          {
            label: 'Sleep Record',
            icon: Images.drawer_sleep,
            navigationScreen: 'WebViewPage',
            url: 'https://meanstack.smartdatainc.com:9307/about',
          },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              selectedLabel === item.label && {
                backgroundColor: '#6832C4',
                paddingHorizontal: 10,
                borderRadius: 30,
              },
            ]}
            onPress={() => {
              setSelectedLabel(item.label);

              if (item.label === 'Subscription Plan') {

                true ?
                props.navigation.navigate(item.navigationScreen, {
                  url: item.url,
                }): props.navigation.navigate('ChangePlan', {
                  url: item.url,
                })


                return
              }

              if (item.navigationScreen) {
                props.navigation.navigate(item.navigationScreen, {
                  url: item.url,
                });
              }
            }}>
            <Image
              source={item.icon}
              style={{
                height: '24',
                width: '24',
                borderRadius: 10,
                marginRight: 16,
              }}
              tintColor={'#fff'}
            />
            <AppText style={styles.menuLabel}>{item.label}</AppText>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.notificationSection}>
        <TouchableOpacity
          style={{ flexDirection: 'row', flex: 1 }}
          onPress={logoutCalled}>
          <AppImage
            source={Images.drawer_logout}
            style={{
              height: '24',
              width: '24',
              borderRadius: 10,
              marginRight: 16,
            }}
            tintColor={'#fff'}
          />
          <AppText style={styles.notificationLabel}>Logout</AppText>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12082F',
  },

  menuSection: {
    marginVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(26),
    padding: 10,
    borderRadius: 30,
  },

  menuLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#efef',
  },
  notificationSection: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 30,
    marginHorizontal: 30,
  },
  notificationLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#fff',
  },
  background: {
    resizeMode: 'cover',
    width: moderateScale(239),
    height: moderateScale(116),
    marginVertical: moderateScale(30),
    marginHorizontal: 4,
  },
});
