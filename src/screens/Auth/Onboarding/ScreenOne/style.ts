import { APP_COLORS } from "@constants/color";
import { Platform, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: APP_COLORS.IMAGE_BACKGROUND_COLOR
  },

  skipText: {
    color: '#FFFFFF',
    fontSize: moderateScale(14),
    fontWeight: '500',
    marginTop: moderateScale(20),
  },

  container1: {
    flex: 1,
    flexDirection: 'column-reverse',
    marginBottom: moderateScale(10),
    marginHorizontal: moderateScale(20),
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  }
});

export default styles;