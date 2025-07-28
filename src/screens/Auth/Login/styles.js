import {APP_COLORS} from '@constants/color';
import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  scroll: {flexGrow: 1, alignItems: 'center', marginTop: moderateScale(16)},

  container: {flex: 1},

  input: {
    borderWidth: 1,
    borderColor: APP_COLORS.TEXT_INPUT_BORDER_COLOR,
    borderRadius: 100,
    alignItems: 'center',
    flexDirection: 'row',
    height: moderateScale(50),
    paddingLeft: moderateScale(18),
  },

  bottomContainer: {
    marginTop: moderateScale(34),
  },

  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotButtonText: {
    color: APP_COLORS.WHITE,
    fontSize: '400',
    fontSize: 12,
  },
  formBackground: {
    width: moderateScale(327),
    height: moderateScale(560),
    padding: moderateScale(22),
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: APP_COLORS.BORDER_COLOR,
    borderRadius: 40,
  },
  button: {
    backgroundColor: '#6832C4',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 24,
    borderColor: '#AB9BDD',
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
  },
  haveAccountText: {
    fontWeight: '300',
    fontSize: moderateScale(14),
    color: APP_COLORS.WHITE,
    marginTop: moderateScale(24),
    textAlign: 'center',
  },
  socialIcon: {
    width: moderateScale(64),
    height: moderateScale(64),
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: moderateScale(14),
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: moderateScale(24),
  },
  orLine: {
    borderColor: '#FFFFFF1F',
    width: '118',
    height: 1,
    borderWidth: 0.8,
  },
  orText: {
    color: '#FFFFFF66',
    fontSize: moderateScale(18),
    fontWeight: 400,
    marginHorizontal: moderateScale(8),
  },
  inputIcon: {
    width: moderateScale(18),
    height: moderateScale(18),
    marginRight: moderateScale(8),
  },
  subHeading: {
    color: APP_COLORS.TEXT_COLOR,
    fontSize: moderateScale(14),
    fontWeight: '300',
    textAlign: 'center',
    marginTop: moderateScale(8),
  },
  heading: {
    color: APP_COLORS.WHITE,
    fontWeight: '400',
    fontSize: moderateScale(20),
    textAlign: 'center',
  },
  inputText: {
    flex: 1,
    color: '#FFFFFF',
  },
});

export default styles;
