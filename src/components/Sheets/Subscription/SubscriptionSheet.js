import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Images} from '@assets/index';
import AppText from '@components/AppText';
import {moderateScale} from 'react-native-size-matters';
import AppButton from '@components/AppButton';
import {useQuery} from '@tanstack/react-query';
import {getRequest} from '@api/apiService';
import {APIS} from '@api/apiSheet';
import {useNavigation} from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const horizontalSpacing = screenWidth * 0.01;

const SubscriptionSheet = ({sheetRef, item = {}, onClose}) => {
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [subscription, setSubscription] = useState(null);

  const {data, isLoading, isError, error} = useQuery({
    queryKey: ['subscriptionList'],
    queryFn: () =>
      getRequest(`${APIS.GET_SUBSCRIPTION_PLAN}?limit=10&page=1&searchText=`),
  });

  useEffect(() => {
    if (data?.data) {
      setSubscription(data.data?.result);
    }
  }, [data]);

  console.log('data', data);
  console.log('isLoading>>>>>', isLoading);

  const renderItem = ({item, index}) => {
    console.log('item>>>>>>', item);
    const isLastItem = index === data.length - 1;
    return (
      <TouchableOpacity
        onPress={() => setSelectedIndex(index)}
        // onPress={() =>navigation.navigate('Payment')}
        style={{
          marginRight: isLastItem ? 0 : horizontalSpacing - 40,
          marginLeft: Platform.OS === 'android' ? horizontalSpacing / 2 : 0,
        }}>
        <ImageBackground
          source={Images.subscriptionBox}
          style={[styles.subscriptionBox]}
          imageStyle={styles.subscriptionBoxImage}>
          <View style={[styles.radioAndTextContainer]}>
            <View style={styles.radioOuter}>
              {selectedIndex === index && (
                <Image source={Images.tickmark} style={styles.radioInner} />
              )}
            </View>
            <View style={styles.textContainer}>
              <AppText style={styles.planTitle}>
                <AppText style={{fontWeight: 700}}>{item?.planPrice}</AppText> /{' '}
                {item?.planDuration}
              </AppText>
              <AppText style={styles.planDescription}>{item?.planName}</AppText>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <ActionSheet ref={sheetRef}>
      <SafeAreaView>
        <ImageBackground source={Images.background} style={styles.container}>
          <View style={styles.container}>
            <TouchableOpacity onPress={onClose} style={styles.crossButton}>
              <Image source={Images.crossImage} style={styles.crossImage} />
            </TouchableOpacity>
            <Image source={Images.plusIcon} style={styles.plusIcon} />
            <Image source={Images.sleepingImage} style={styles.sleepingImage} />
            <Image source={Images.starImage} style={styles.starImage} />

            <View style={styles.headingContainer}>
              <AppText style={styles.titleText}>
                Sleep Smarter, Live Better
              </AppText>
              <AppText style={styles.subtitleText}>
                Unlock better sleep with premium sounds, insights, and expert
                care.
              </AppText>
            </View>

            <FlatList
              horizontal
              data={subscription}
              keyExtractor={item => item._id}
              renderItem={renderItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingLeft: 14}}
            />

            <View style={styles.buttonView}>
              <AppButton
                btnText={'Subscribe'}
             btnStyle={[
                        styles.button,
                        selectedIndex === null && { backgroundColor: 'transparent' }, // greyed-out style
                        ]}  
                 btnTextStyle={styles.buttonText}
                onPress={() => {
                  Platform.OS === 'ios' ? onClose() :null,
                  navigation.navigate('MySubscription')
                }}
                disabled={selectedIndex === null}

              />
              <View style={styles.bottomText}>
                <AppText
                  style={{color: '#fff', fontSize: 14, fontWeight: '400'}}>
                  By continuing, you agree to
                </AppText>
                <View style={{flexDirection: 'row'}}>
                  <AppText
                    style={{
                      textDecorationLine: 'underline',
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: '400',
                    }}>
                    Privacy Policy{' '}
                  </AppText>
                  <AppText
                    style={{color: '#fff', fontSize: 14, fontWeight: '400'}}>
                    {' '}
                    and{' '}
                  </AppText>
                  <AppText
                    style={{
                      textDecorationLine: 'underline',
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: '400',
                    }}>
                    Terms & Condition
                  </AppText>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  crossImage: {
    height: 30,
    width: 30,
    alignSelf: 'flex-end',
    marginTop: 50,
    resizeMode: 'contain',
    marginRight: 30,
  },
  plusIcon: {
    width: 92,
    height: 48,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  sleepingImage: {
    width: 195,
    height: 180,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  starImage: {
    width: 140,
    height: 45,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 20,
  },
  titleText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 22,
    lineHeight: 20,
    width: 259,
  },
  subtitleText: {
    marginVertical: 10,
    color: '#FFFFFF',
    fontWeight: '400',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 28,
    width: 259,
  },
  subscriptionBox: {
    width: 230,
    height: 100,
    justifyContent: 'center',
    paddingHorizontal: 24,
    overflow: 'hidden',
  },
  subscriptionBoxImage: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
  radioAndTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 20,
    height: 20,
    borderRadius: 5,
  },
  textContainer: {
    fontWeight: 400,
    color: '#FFFF',
    fontSize: 11,
  },
  planTitle: {
    fontWeight: 400,
    color: '#FFFF',
    fontSize: 15,
  },
  planDescription: {
    fontWeight: 400,
    color: '#FFFF',
    fontSize: 11,
    marginTop: moderateScale(2),
  },
  bottomContainer: {
    marginBottom: moderateScale(24),
  },
  buttonView: {
    marginBottom: Platform.OS==='ios'? moderateScale(40): moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  button: {
    backgroundColor: '#6832C4',
    borderRadius: 24,
    width: '90%',
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
  crossButton: {
    alignSelf: 'flex-end',
  },
  headingContainer: {
    marginVertical: Platform.OS == 'ios' ? 15 : 20,
    alignItems: 'center',
  },
  bottomText: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default SubscriptionSheet;
