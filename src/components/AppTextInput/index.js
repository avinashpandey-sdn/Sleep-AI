// import { APP_COLORS } from '@configs/theme';
import React from 'react';
import {TextInput} from 'react-native-paper';
import {styles} from './styles';
import {APP_COLORS} from '@constants/color';

const AppTextInput = props => {
  const {mode = 'outlined', roundness = 12, textinputStyle} = props;
  return (
    <TextInput
      mode={mode}
      style={[styles.textinput, textinputStyle]}
      placeholderTextColor={APP_COLORS.TEXT_INPUT_PLACEHOLDER_TEXT_COLOR}
      // theme={{colors: {primary: APP_COLORS.WHITE}, roundness: roundness}}
      outlineColor={APP_COLORS.BORDER_COLOR}
      {...props}
    />
  );
};

export default AppTextInput;
