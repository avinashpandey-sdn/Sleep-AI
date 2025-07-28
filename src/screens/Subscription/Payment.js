import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Images } from '@assets/index';
import AppText from '@components/AppText';
import { moderateScale } from 'react-native-size-matters';
import AppImage from '@components/AppImage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStripe } from '@stripe/stripe-react-native';
import { APIS } from '@api/apiSheet';
import { postRequest } from '@api/apiService';
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubscriptionPlans } from '@app/reducers/subscription/subscription.thunk';
import { saveTransactionData } from '@app/reducers/TransactionHistory/transaction.thunk';

const Payment = () => {
  const navigation = useNavigation();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const route = useRoute();
  const { plan } = route.params;
  const AuthData = useSelector(state => state.auth);
  console.log("AuthData",AuthData)
  console.log("plan",plan)

const userFullNameData = AuthData?.userLoginData?.userData;

const fullName = userFullNameData
  ? `${userFullNameData.firstName || ''} ${userFullNameData.lastName || ''}`.trim()
  : '';

  console.log("fullName",fullName)
  // const [planDetails, setPlanDetails] = useState({
  //   planName: 'Basic',
  //   planDescription: '$99',
  //   discount: '$2',
  //   total: '$7',
  // });
const discountAmount = plan?.discountPercentage
  ? (plan.planPrice * plan.discountPercentage) / 100
  : 0;
const finalTotal = plan?.planPrice - discountAmount;

const planDetails = {
  planName: plan?.planName ?? '-',
  planDescription: `$${plan?.planPrice?.toFixed(2) ?? '0.00'}`,
  discount: plan?.discountPercentage
    ? `$${discountAmount.toFixed(2)} (${plan.discountPercentage}%)`
    : '$0.00',
  total: `$${finalTotal?.toFixed(2) ?? '0.00'}`,
};

  const planDetailsData = [
    { label: 'Plan Name', key: 'planName' },
    { label: 'Plan Price', key: 'planDescription' },
    { label: 'Discount', key: 'discount' },
    { label: 'Total', key: 'total' },
  ];
const dispatch = useDispatch();

// useEffect(() => {
//   if (paymentIntentData) {
//     dispatch(saveTransactionData(paymentIntentData));
//   }
// }, []);
  const BackButton = () => {
    return (
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <AppImage source={Images.back} style={styles.backIcon} />
      </TouchableOpacity>
    );
  };
const {
  mutate: openStripeSheet,
  isPending,
}  = useMutation({
  mutationFn: () =>
    postRequest(APIS.CREATE_PAYMENT_INTENT, {
      payment_method_types: "card",
      description: plan?.description,
      plan_name: plan?.planName,
      plan_price: plan?.planPrice,
      plan_type: plan?.planDuration,
      userId:plan?._id,
      payment_mode: "Stripe",
      payment_type: "Credit Card",
      services:plan?.services,
      name: fullName
    }),

  onSuccess: async data => {
    try {
      console.log("Paymentdata------->",data)
      const clientSecret = data?.data?.client_secret;

      if (!clientSecret) {
        alert('Client secret not received.');
        return;
      }

      const initSheet = await initPaymentSheet({
        merchantDisplayName: 'aisleep',
        paymentIntentClientSecret: clientSecret,
        allowsDelayedPaymentMethods: true,
      });
      console.log("initSheet", initSheet);

      if (initSheet.error) {
        alert(`Init Error: ${initSheet.error.message}`);
        return;
      }

      const result = await presentPaymentSheet();
      console.log("result", result);
      if (result.error) {
        alert(`Payment failed: ${result.error.message}`);
      } else {
        // alert('Payment successful!');
        // You can dispatch success state or call log APIs here
        const paymentIntentData = data?.data
        const response = await postRequest(APIS.SAVE_PAYMENT_DATA, {
          data: paymentIntentData,
        });
        console.log('SAVE_PAYMENT_DATA response:', response);

        alert('Payment saved successfully!');
          dispatch(saveTransactionData(paymentIntentData));
      }
    } catch (err) {
      console.error('Stripe Payment Error:', err);
      alert('Something went wrong during payment!');
    }
  },

  onError: error => {
    console.error('Error creating payment intent:', error);
    alert('Unable to start payment. Please try again.');
  },
});

const handleStripePress = () => {
  openStripeSheet();
};
  return (
    <SafeAreaView>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.headerContainer}>
          <View style={styles.backButtonContainer}>
            <BackButton />
          </View>
          <AppText style={styles.headerText}>Payment</AppText>
        </View>

        {/* Plan Details */}
        <AppText style={styles.paymentDetailsTitle}>Payment Details </AppText>

        <View style={styles.summaryBox}>
          <FlatList
            data={planDetailsData}
            keyExtractor={(item) => item.key}
            renderItem={({ item, index }) => (
              <View>
                <View style={styles.detailRow}>
                  <AppText style={styles.detailLabel}>{item.label}</AppText>
                  <AppText style={styles.detailValue}>{planDetails[item.key]}</AppText>
                </View>
                {index !== planDetailsData.length - 1 && (
                  <View style={styles.separator} />
                )}
              </View>
            )}
          />
        </View>

        <View style={{ alignItems: 'center', marginTop: 30 }}>
          <TouchableOpacity
            style={[styles.button, isPending && { opacity: 0.7 }]}
            onPress={handleStripePress}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <AppText style={styles.buttonText}>Pay with Stripe</AppText>
            )}         
   </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#160E3B',
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
    color: '#fff',
  },
  paymentDetailsTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    margin: 26,
    alignSelf: 'flex-start',
  },
  summaryBox: {
    backgroundColor: '#241A52',
    borderRadius: 14,
    marginHorizontal: 28,
    padding: 16,
    marginTop: 2,
    width: moderateScale(335),
    alignSelf: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  detailLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '400',
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#3D326E',
    marginVertical: 8,
    width: '100%',
  },
  button: {
    backgroundColor: '#6832C4',
    borderRadius: 24,
    borderColor: '#6832C4',
    borderWidth: 1,
    width: '90%',
    padding: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
  },
});

export default Payment;
