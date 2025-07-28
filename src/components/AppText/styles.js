import {APP_FONTS} from '@assets/fonts';
import {APP_COLORS} from '@constants/color';
import {StyleSheet} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

export const styles = StyleSheet.create({
  text: {
    fontFamily: APP_FONTS.REGULAR,
    color: APP_COLORS.TEXT_COLOR,
    fontSize: RFPercentage(1.5),
  },
});
