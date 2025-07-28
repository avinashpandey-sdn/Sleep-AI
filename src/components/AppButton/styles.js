import {APP_FONTS} from '@assets/fonts';
import {APP_COLORS} from '@constants/color';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  btn: {
    backgroundColor: APP_COLORS.BUTTON_BACKGROUND,
    paddingVertical: 15,
    borderRadius: 12,
    width: '100%',
  },
  btnText: {
    color: APP_COLORS.WHITE,
    textAlign: 'center',
    fontFamily: APP_FONTS.REGULAR,
  },
});
