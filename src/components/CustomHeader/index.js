import {Images} from '@assets/index';
import AppImage from '@components/AppImage';
import AppText from '@components/AppText';
import {APP_COLORS} from '@constants/color';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';

const CustomHeader = ({
  type,
  userName = '',
  onHamburgerPress,
  onNotificationPress,
  firstIcon,
  secondIcon,
  lastIcon,
  firstIconClick = () => {},
}) => {
  if (type === 'primary') {
    return (
      <View style={styles.primaryContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={onHamburgerPress}
            style={{marginRight: 14}}>
            <Image source={Images.threeLine} style={styles.threeLine} />
          </TouchableOpacity>

          <AppText style={styles.userName}>{userName}</AppText>
        </View>

        <TouchableOpacity onPress={onNotificationPress}>
          <AppImage source={Images.notification} style={styles.rightIcon} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.secondContainer}>
      <TouchableOpacity onPress={firstIconClick}>
        <View style={styles.sideIcon}>{firstIcon}</View>
      </TouchableOpacity>

      <View style={styles.centerIcon}>{secondIcon}</View>

      <View style={styles.sideIcon}>
        {lastIcon ? lastIcon : <View style={{width: 24}} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  primaryContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: APP_COLORS.WHITE,
  },
  secondContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  sideIcon: {
    width: 50,
    alignItems: 'center',
  },
  centerIcon: {
    flex: 1,
    alignItems: 'center',
  },
  threeLine: {
    width: 20,
    height: 16,
  },
  rightIcon: {
    width: 24,
    height: 24,
  },
});

export default CustomHeader;
