import {Images} from '@assets/index';
import {useNavigation} from '@react-navigation/native';
import React, {useRef} from 'react';
import {
  ImageBackground,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
} from 'react-native';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';
import {useDispatch, useSelector} from 'react-redux';
import {styles} from './styles';

const Appoiment: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const QuestinerSheetRef = useRef(null);
  const AuthData = useSelector(state => state.auth);

  return (
    <ImageBackground source={Images.Homebackground} style={styles.background}>
      <StatusBar barStyle="light-content" backgroundColor={'#160E3B'} />

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.container}>
          <Text style={{color: '#ffff'}}>Appoiment</Text>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Appoiment;
