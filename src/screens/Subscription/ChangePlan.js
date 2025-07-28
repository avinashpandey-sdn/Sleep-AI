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
  PixelRatio,
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
import AppImage from '@components/AppImage';

const screenWidth = Dimensions.get('window').width;
const horizontalSpacing = screenWidth * 0.01;

const ChangePlan = ({sheetRef, item = {}, onClose}) => {
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [subscription, setSubscription] = useState(null);

  const {isPending, error, data} = useQuery({
    queryKey: ['subscriptionList'],
    queryFn: () =>
      getRequest(`${APIS.GET_SUBSCRIPTION_PLAN}?limit=10&page=1&searchText=`),
  });
  useEffect(() => {
    if (data?.data) {
      setSubscription(data.data?.result);
    }
    console.log("data.data?.result",data?.data?.result)
  }, [data]);

  const renderItem = ({item, index}) => {
    const isLastItem = index === data.length - 1;
    return (
      <TouchableOpacity
        onPress={() => setSelectedIndex(index)}
        // onPress={() =>navigation.navigate('MySubscription')}
        style={{
          marginRight: isLastItem ? 0 : horizontalSpacing - 40,
          marginLeft: Platform.OS === 'android' ? horizontalSpacing / 2 : 0,
        }}>
        <ImageBackground
          source={Images.subscriptionBox}
          style={styles.subscriptionBox}
          imageStyle={styles.subscriptionBoxImage}>
          <View style={styles.radioAndTextContainer}>
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
              <AppText style={styles.planDescription}>
                {item?.description}
              </AppText>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };
  const BackButton = () => {
    return (
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <AppImage source={Images.back} style={styles.backIcon} />
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView>
      <ImageBackground source={Images.background} style={styles.container}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.backButtonContainer}>
              <BackButton />
            </View>
            <AppText style={styles.headerText}>Change Plan</AppText>
          </View>
          {/* Top Images */}
          <TouchableOpacity
            onPress={onClose}
            style={styles.crossButton}></TouchableOpacity>
          <Image source={Images.plusIcon} style={styles.plusIcon} />
          <Image source={Images.sleepingImage} style={styles.sleepingImage} />
          <Image source={Images.starImage} style={styles.starImage} />

          {/* Headings */}
          <View style={styles.headingContainer}>
            <AppText style={styles.titleText}>
              Sleep Smarter, Live Better
            </AppText>
            <AppText style={styles.subtitleText}>
              Unlock better sleep with premium sounds, insights, and expert
              care.
            </AppText>
          </View>

          {/* Subscription Options */}
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
              btnText={'Update Plan'}
              btnStyle={[
                        styles.button,
                        selectedIndex === null && { backgroundColor: 'transparent' }, // greyed-out style
                        ]} 
              btnTextStyle={styles.buttonText}
             onPress={() => {
      if (selectedIndex !== null) {
        navigation.navigate('MySubscription', {
          isFromChangePlan: true,
                selectedPlan: subscription[selectedIndex],
                 allPlans: subscription,

                     // pass entire plans array
        });
      }
    }}
              disabled={selectedIndex === null}

            />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  headerContainer: {
    marginVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  crossImage: {
    height: 30,
    width: 30,
    alignSelf: 'flex-end',
    marginVertical: 50,
    resizeMode: 'contain',
    margin: 30,
  },
  plusIcon: {
    width: 92,
    height: 48,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  sleepingImage: {
    width: 200,
    height: 180,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  starImage: {
    width: 200,
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
  },
  subtitleText: {
    marginVertical: 10,
    color: '#FFFFFF',
    fontWeight: '400',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 28,
  },
  subscriptionBox: {
    width: 230,
    height: 100,
    justifyContent: 'center',
    paddingHorizontal: 24,
    // borderRadius: 12,
    overflow: 'hidden', // needed for borderRadius to clip children
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
    // backgroundColor: '#FFF',
  },
  textContainer: {
    fontWeight: 400,
    color: '#FFFF',
    fontSize: 11,
  },
  planTitle: {
    fontWeight: 400,
    color: '#FFFF',
    fontSize: 11,
  },
  planDescription: {
    fontWeight: 400,
    color: '#FFFF',
    fontSize: 11,
  },
  bottomContainer: {
    marginBottom: moderateScale(24),
  },
  buttonView: {
    marginBottom: Platform.OS==='ios'? moderateScale(40): moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  button: {
    backgroundColor: '#6832C4',
    borderRadius: 24,
    width: '90%',
    borderColor: '#AB9BDD',
     borderWidth:0.9
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
  },
  crossButton: {
    alignSelf: 'flex-end',
    // margin: 30,
  },
  headingContainer: {
    marginVertical: Platform.OS == 'ios' ? 15 : 20,
    alignItems: 'center',
  },
  bottomText: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonContainer: {
    position: 'absolute',
    left: 0,
  },
  backButton: {
    paddingTop: Platform.OS === 'android' ? moderateScale(16) : 0,
    marginVertical: moderateScale(20),
    paddingHorizontal: moderateScale(20),
  },
  backIcon: {
    width: moderateScale(30),
    height: moderateScale(30),
  },
  headerText: {
    fontWeight: '400',
    fontSize: 16,
    color: '#ffff',
    marginTop: 13,
  },
});

export default ChangePlan;
