import {Images} from '@assets/index';
import AppButton from '@components/AppButton';
import React from 'react';
import {Image, StyleSheet, Text, View, Platform} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';

const OnboardingFeatureSheet = ({sheetRef, item = {}, onClose}) => {
  return (
    <ActionSheet
      ref={sheetRef}
      containerStyle={{
        backgroundColor: 'black',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
        borderColor: '#3B83A8',
        borderTopWidth: 2,
        borderRightWidth: 0.1,
        borderLeftWidth: 0.1,
      }}>
      <View style={styles.container}>
        <Image
          source={Images.featureImageOne}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>{item?.title || 'Title'}</Text>
        <Text style={styles.description}>
          {item?.description ||
            'This is a default description for the feature. It can be customized based on the feature being showcased.'}
        </Text>
      </View>
      <View style={[styles.bottomContainer]}>
        <AppButton
          btnText={'Next'}
          btnStyle={styles.button}
          btnTextStyle={styles.buttonText}
          onPress={onClose}
        />
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 24,
  },
  bottomContainer: {
    marginVertical: 16,
    paddingHorizontal: 24,
    marginTop: 24,
  },
  image: {
    width: 327,
    height: 328,
    borderRadius: 20,
  },
  description: {
    fontSize: 12,

    fontWeight: '400',
    color: '#FFFFFF',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#6832C4',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 24,
    borderColor: '#6832C4',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 18,
  },
});

export default OnboardingFeatureSheet;
