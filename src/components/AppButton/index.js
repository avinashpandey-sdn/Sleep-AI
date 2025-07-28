import React from 'react';
import {ActivityIndicator, Image, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import AppText from '@components/AppText';

const AppButton = props => {
  const {
    children,
    btnStyle = {},
    btnTextStyle = {},
    btnText,
    icon,
    iconStyle = {},
  } = props;

  return (
    <TouchableOpacity style={[styles.btn, btnStyle]} {...props}>
      {icon && (
        <Image
          source={icon}
          style={[
            {
              width: 20,
              height: 20,
              resizeMode: 'contain',
              tintColor: 'white',
            },
            iconStyle,
          ]}
        />
      )}
      <AppText textStyle={[styles.btnText, btnTextStyle]}>{btnText}</AppText>
      {children}
    </TouchableOpacity>
  );
};

export default AppButton;
