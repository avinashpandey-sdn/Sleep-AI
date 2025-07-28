// import {APP_FONTS} from '@configs/appFont';
// import {APP_COLORS} from '@configs/theme';
import {APP_FONTS} from '@assets/fonts';
import {APP_COLORS} from '@constants/color';
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {moderateScale} from 'react-native-size-matters';
const AppDropDown = ({
  data = [],
  value,
  setValue,
  labelField = 'label',
  valueField = 'value',
  searchEnabled = true,
  mode = 'auto', //auto,default
  placeholderText = '---   Select   ---',
  dropDownStyle = {},
  ...props
}) => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <Dropdown
      style={[
        styles.dropdown,
        dropDownStyle,
        isFocus && {borderColor: APP_COLORS.THEME_DARK},
      ]}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      mode={mode}
      iconStyle={styles.iconStyle}
      data={data}
      search={searchEnabled}
      maxHeight={300}
      labelField={labelField}
      valueField={valueField}
      placeholder={!isFocus ? placeholderText : '...'}
      searchPlaceholder="Search..."
      value={value}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={item => {
        setValue(item);
        setIsFocus(false);
      }}
      {...props}
    />
  );
};

export default AppDropDown;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: moderateScale(56),
    borderColor: APP_COLORS.BORDER_COLOR_1,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(16),
  },
  icon: {
    marginRight: moderateScale(5),
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: moderateScale(22),
    top: moderateScale(8),
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: moderateScale(14),
  },
  placeholderStyle: {
    fontSize: 14,
    color: APP_COLORS.TEXT_INPUT_PLACEHOLDER_TEXT_COLOR,
    fontFamily: APP_FONTS.REGULAR,
  },
  selectedTextStyle: {
    fontSize: moderateScale(16),
    color: 'white',
  },
  iconStyle: {
    width: moderateScale(20),
    height: moderateScale(20),
  },
  inputSearchStyle: {
    height: moderateScale(40),
    fontSize: moderateScale(16),
  },
});
