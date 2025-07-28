import { APP_COLORS } from "@constants/color";
import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";

export const styles = StyleSheet.create({
  container: { flex: 1 },

  text: {
    fontSize: 16,
    color: '#333',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  actionContainer: { backgroundColor: 'black', height: '100%' },

  progressHeaderContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    backgroundColor: 'transparent',
  },
  pageText: {
    color: '#FFFFFF',
    marginLeft: 10,
    marginRight: 'auto',
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'right'
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    // marginTop: moderateScale(16),
  },
  formBackground: {
    width: moderateScale(336),
    height: moderateScale(800),
    paddingHorizontal: moderateScale(22),
    margin: moderateScale(50),
    resizeMode: 'contain',
  },
  inputIcon: {
    width: moderateScale(127),
    height: moderateScale(127),
  },

  questnerHeading: {
    fontSize: 20,
    fontWeight: '400',
    color: APP_COLORS.WHITE,
    textAlign: 'center',
    marginBottom: moderateScale(28),
  },
  button: {
    backgroundColor: '#6832C4',
    borderWidth: 1,
    borderRadius: 100,
    height: moderateScale(50),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

  input: {
    borderWidth: 1,
    borderColor: APP_COLORS.TEXT_INPUT_BORDER_COLOR,
    borderRadius: 100,
    alignItems: 'center',
    flexDirection: 'row',
    height: moderateScale(50),
    paddingLeft: moderateScale(18),
    backgroundColor: '#FFFFFF0A',
    color: 'white',
    marginBottom: 20,
    gap: 10
  },
  inputIconTextbox: {
    width: moderateScale(18),
    height: moderateScale(18),


  },
  profileCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Needed for absolute positioning of the icon
  },
  uploadIcon: {
    width: 32,
    height: 32,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  inputText: {
    fontSize: 14,
    fontWeight: 300,
    color: '#FFFFFF',
    flex: 1

  },


})