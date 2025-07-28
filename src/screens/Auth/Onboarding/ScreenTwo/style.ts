import { APP_COLORS } from '@constants/color';
import { Platform, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: APP_COLORS.BACKGROUND_COLOR
  },
  container: { marginHorizontal: 24, flex: 1 },
  content: {
    flex: 1,
    marginTop: moderateScale(24),
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: '400',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '300',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },

  card: {
    width: 155,
    height: 155,
    marginBottom: 18,
  },
  featureImage: {
    width: '100%',
    height: '100%',
  },
  bottomContainer: {
    marginVertical: Platform.OS == 'android' ? null : 16,
    marginTop: Platform.OS == 'android' ? null : 24,
  },
  button: {
    backgroundColor: '#6832C4',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 100,
    borderColor: '#6832C4',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
  },
});
export default styles;
