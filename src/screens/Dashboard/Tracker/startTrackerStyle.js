import {APP_COLORS} from '@constants/color';
import {PixelRatio, Platform, StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    paddingHorizontal: 20,
    paddingTop: 40,
    justifyContent: 'space-between',
  },
  Duration: {
    color: '#A3A3A3',
    fontSize: 10,
    fontWeight: '400',
    marginTop: 20,
  },
  durationTime: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 4,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: 'white',
    fontSize: 16,
  },
  statusIcons: {
    flexDirection: 'row',
  },
  icon: {
    width: 18,
    height: 18,
    marginLeft: 6,
    resizeMode: 'contain',
  },
  sleepMaskBox: {
    backgroundColor: '#09001F66',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: Platform.OS === 'android' ? 0 : 20,
  },
  sleepMaskIcon: {
    width: 20,
    height: 10,
    marginRight: 10,
  },
  sleepMaskText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 10,
  },
  sleepMaskSubText: {
    color: 'gray',
    fontWeight: '400',
    fontSize: 8.6,
  },
  clock: {
    fontSize: 60,
    fontWeight: '400',
    color: APP_COLORS.WHITE,
    alignSelf: 'center',
    marginTop: 39,
  },
  playButton: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: 56,
    height: 56,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',

    borderColor: '#AB9BDD',
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    borderRightWidth:
      Platform.OS === 'android' ? PixelRatio.roundToNearestPixel(0.2) : 0.2,
    borderLeftWidth:
      Platform.OS === 'android' ? PixelRatio.roundToNearestPixel(0.2) : 0.2,
    borderRightColor: '#FF56C5B8',
    borderLeftColor: '#A049FFB2',
  },
  playIcon: {
    width: 16,
    height: 16,
  },
  trackText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '300',
  },
  musicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 20,
    marginBottom: Platform.OS === 'android' ? 20 : 40,
    borderColor: '#AB9BDD',
    borderTopWidth:
      Platform.OS === 'android' ? PixelRatio.roundToNearestPixel(0.1) : 0.1,
    borderBottomWidth:
      Platform.OS === 'android' ? PixelRatio.roundToNearestPixel(0.1) : 0.1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#A049FFB2',
    borderRightColor: '#FF56C5B8',
    borderTopColor: '#91DEFF00',
    borderBlockEndColor: '#91DEFF00',
  },
  musicImage: {
    width: 48,
    height: 48,
    borderRadius: 20,
  },
  musicInfo: {
    flex: 1,
    marginLeft: 10,
  },
  musicTitle: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  musicSubtitle: {
    color: '#FFFFFF99',
    fontSize: 12,
    fontWeight: '300',
  },
  musicIcon: {
    width: 24,
    height: 24,
  },
});
