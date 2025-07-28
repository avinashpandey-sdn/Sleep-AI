import {Images} from '@assets/index';
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {styles} from './styles';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';
import SubscriptionSheet from '@components/Sheets/Subscription/SubscriptionSheet';
import ProfileSetupSheet from '@components/Sheets/ProfileSetup';

export default function Profile() {
  const screenOneData = useSelector(state => state);
  const [showSubscription, setShowSubscription] = useState(true);
  const SubscriptionSheetRef = useRef(null);
  const ProfileSetupSheetRef = useRef(null);
  console.log('screenOneData><><', screenOneData);
  return (
    <ImageBackground source={Images.Homebackground} style={styles.background}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.container}>
          <Text style={{color: '#ffff'}}>Profile screen</Text>
          <TouchableOpacity style={{paddingVertical:10}}
            onPress={() => {
              SubscriptionSheetRef.current?.show();
            }}
          >
         <Text style={{color: '#ffff'}}>Subscription Modal</Text>

          </TouchableOpacity>
           <TouchableOpacity style={{paddingVertical:10}}
            onPress={() => {
              ProfileSetupSheetRef.current?.show();
            }}
          >
         <Text style={{color: '#ffff'}}>Profile Setup Modal</Text>

          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
      <SubscriptionSheet
        sheetRef={SubscriptionSheetRef}
        // item={selectedItem}
        onClose={() => {
          // navigation.navigate('AuthOption');
          SubscriptionSheetRef.current?.hide();
        }}
      />
       <ProfileSetupSheet
        sheetRef={ProfileSetupSheetRef}
        // item={selectedItem}
        onClose={() => {
          // navigation.navigate('AuthOption');
          ProfileSetupSheetRef.current?.hide();
        }}
      />
    </ImageBackground>
  );
}
