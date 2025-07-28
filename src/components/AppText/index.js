import React from 'react';
import {Text} from 'react-native';
import {styles} from './styles';

const AppText = props => {
  const {textStyle = {}, onPress, children} = props;
  return (
    <Text onPress={onPress} style={[styles.text, textStyle]} {...props}>
      {children}
    </Text>
  );
};

export default AppText;
