import React, {useEffect, useState} from 'react';

import {
  Text,
  View,
  FlatList,
  ImageBackground,
  Platform,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  PixelRatio,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Images} from '@assets/index';
import AppText from '@components/AppText';
import {moderateScale} from 'react-native-size-matters';
import AppImage from '@components/AppImage';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

const screenWidth = Dimensions.get('window').width;
import {useRoute} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import {getRequest, postRequest} from '@api/apiService';
import {APIS} from '@api/apiSheet';
import {setCurrentPlan} from '@app/reducers/auth/auth.slice';

const MySubscriptions = () => {
  const navigation = useNavigation();
  const [planDetails, setPlanDetails] = useState([]);
  const route = useRoute();
  const isFromChangePlan = route.params?.isFromChangePlan ?? false;
  const {selectedPlan} = route.params || {};
  const planId = selectedPlan?._id;
  // Example usage:
  console.log('Selected Plan:', planId);
  const {isPending, error, data} = useQuery({
    queryKey: ['planDetailList', planId],
    queryFn: () => getRequest(`${APIS.GET_PLAN_DETAILS}?id=${planId}`),
    enabled: !!planId,
  });
  useEffect(() => {
    if (data?.data?.result) {
      console.log('API Result:', data.data.result);
      setPlanDetails(data.data.result);
    }
  }, [data]);

  console.log('Get planDetailList list ', data);
  // const planFeatures = [
  //   'Experience our full library',
  //   '200+ soundscapes',
  //   '60+ meditations',
  //   '20+ sleep sounds',
  //   'Mix your own sleep sounds',
  //   'No ads, enjoy free',
  // ];
  const createdAt = data?.data?.createdAt;
  const planDuration = data?.data?.planDuration?.toLowerCase();
  const startDate = moment(createdAt).format('DD/MM/YYYY');

  const endDate =
    planDuration === 'monthly'
      ? moment(createdAt).add(28, 'days').format('DD/MM/YYYY') // ➕ exactly 28 days
      : moment(createdAt).add(1, 'year').format('DD/MM/YYYY'); // ➕ 1 year for annual

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
      <ScrollView style={styles.container}>
        {/* Top Header */}
        <View style={styles.headerContainer}>
          <View style={styles.backButtonContainer}>
            <BackButton />
          </View>
          <AppText style={styles.headerText}>My Subscription</AppText>
        </View>

        {/* Banner */}
        <ImageBackground
          source={Images.my_subscription_banner}
          style={styles.subscriptionBanner}
          imageStyle={styles.bannerImage}>
          <View style={styles.planInfoContainer}>
            <View style={styles.currentPlanRow}>
              <AppText style={styles.currentPlanText}>Current Plan</AppText>
              <AppImage source={Images.tickmark} style={styles.tickIconSmall} />
            </View>
            <AppText style={styles.planName}>{data?.data?.planName}</AppText>
            <AppText style={styles.planDate}>Start Date : {startDate}</AppText>
            <AppText style={styles.planDate}>End Date : {endDate}</AppText>
          </View>

          {/* Price Tag */}
          <ImageBackground
            source={Images.my_subscription_button_banner}
            style={styles.priceTag}
            imageStyle={styles.priceTagImage}>
            <View style={styles.priceTextRow}>
              <AppText style={styles.priceMain}>
                ${data?.data?.planPrice}
              </AppText>
              <AppText style={styles.priceSub}>
                /{' '}
                {data?.data?.planDuration?.toLowerCase() === 'monthly'
                  ? 'Month'
                  : 'Annual'}
              </AppText>
            </View>
          </ImageBackground>
        </ImageBackground>

        {/* Plan Details */}
        <AppText style={styles.planDetailsTitle}>Plan Details :</AppText>

        {/* Feature List */}
        <View style={styles.featuresBox}>
          <FlatList
            data={data?.data?.services || []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View style={styles.featureRow}>
                <AppImage source={Images.tickmark} style={styles.bulletIcon} />
                <AppText style={styles.featureText}>{item}</AppText>
              </View>
            )}
          />
        </View>
        <View style={{alignSelf: 'center', marginTop: 40}}>
          {!isFromChangePlan ? (
            <>
              <TouchableOpacity
                onPress={() => navigation.navigate('ChangePlan')}
                style={styles.button}>
                <AppText style={styles.buttonText}>Change Plan</AppText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('SubscriptionHistory');
                }}
                style={[styles.button, styles.buttonSpacing]}>
                <AppText style={styles.buttonText}>View History</AppText>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Payment', {
                  plan: selectedPlan, // Replace this with your actual selected plan object
                })
              }
              style={[
                styles.button,
                {backgroundColor: '#6832C4', marginBottom: 18},
              ]}>
              <AppText style={styles.buttonText}>Make Payment</AppText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{borderWidth: 1, padding: 10, borderColor: 'white'}}
            onPress={() => {
              navigation.navigate('SleepNotes');
            }}>
            <Text style={{color: '#ffff'}}>SleepNotes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#160E3B',
    // alignItems:'center'
  },
  headerContainer: {
    marginVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
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
  },
  subscriptionBanner: {
    width: screenWidth * 1.01,
    height: 164,
    marginVertical: 20,
  },
  bannerImage: {
    resizeMode: 'contain',
  },
  planInfoContainer: {
    marginHorizontal: moderateScale(62),
    alignSelf: 'flex-start',
    marginVertical: moderateScale(12),
  },
  currentPlanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  currentPlanText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#fff',
  },
  tickIconSmall: {
    width: moderateScale(12),
    height: moderateScale(12),
    resizeMode: 'contain',
    overflow: 'visible',
  },

  planName: {
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
  },
  planDate: {
    fontSize: 12,
    fontWeight: '400',
    color: '#fff',
  },
  priceTag: {
    width: 140,
    height: 40,
    marginHorizontal: 62,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  priceTagImage: {
    resizeMode: 'contain',
  },
  priceTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceMain: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  priceSub: {
    color: '#fff',
    fontWeight: '300',
    fontSize: 15,
  },
  planDetailsTitle: {
    color: '#9F67FF',
    fontWeight: '600',
    fontSize: 16,
    margin: 25,
    alignSelf: 'flex-start',
  },
  featuresBox: {
    backgroundColor: '#241A52',
    borderRadius: 14,
    marginHorizontal: 30,
    padding: 16,
    width: moderateScale(327),
    alignSelf: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 11,
  },
  bulletIcon: {
    width: moderateScale(18),
    height: moderateScale(18),
    marginRight: 10,
    resizeMode: 'contain',
    overflow: 'visible',
  },

  featureText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '400',
    flex: 1,
  },
  button: {
    backgroundColor: '#6832C4',
    borderRadius: 100,
    height: moderateScale(42),
    width: moderateScale(327),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderColor: '#AB9BDD',
    // borderTopWidth:
    //   Platform.OS === 'android' ? PixelRatio.roundToNearestPixel(0.2) : 0.2,
    // borderBottomWidth:
    //   Platform.OS === 'android' ? PixelRatio.roundToNearestPixel(0.2) : 0.2,
    // borderRightWidth: 1,
    // borderLeftWidth: 1,
  },

  buttonText: {
    fontWeight: '400',
    fontSize: 14,
    color: '#FFFFFF',
  },
  buttonSpacing: {
    marginTop: 18,
    marginBottom: 35,
  },
});

export default MySubscriptions;
