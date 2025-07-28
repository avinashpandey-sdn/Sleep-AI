import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Images } from '@assets/index';
import AppText from '@components/AppText';
import { moderateScale } from 'react-native-size-matters';
import AppImage from '@components/AppImage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { getRequest } from '@api/apiService';
import { APIS } from '@api/apiSheet';
import { useSelector } from 'react-redux';
import { saveTransactionData } from '@app/reducers/TransactionHistory/transaction.thunk';
import moment from 'moment'; // helpful for date manipulation

const screenWidth = Dimensions.get('window').width;

const SubscriptionHistory = () => {
    const navigation = useNavigation();
    const route = useRoute();
      const [transactions, setTransactions] = useState([]);
      const { data: latestTransaction } = useSelector(state => state.transaction);
const userData = useSelector(state => state?.auth?.userLoginData?.userData);
// console.log('userData-----:', userData);
  
console.log('transactionData-----:', latestTransaction);
const currentDate = moment();
const startOfMonth = currentDate.clone().startOf('month').format('YYYY-MM-DD');
const endOfMonth = currentDate.clone().endOf('month').format('YYYY-MM-DD');

// const payload = {
//     limit: 10,
//     page: 1,
//     userId: '68625279caf0f21945049413',
//     fromDate: '2025-08-01',
//     toDate: '2025-08-31',
//   };
  const payload = {
  limit: 10,
  page: 1,
  userId: userData?._id, // fallback to latestTransaction
  fromDate: startOfMonth,
  toDate: endOfMonth,
};
console.log("payload---->", payload)
const { isPending, error, data } = useQuery({
    queryKey: ['transactionList'],
       queryFn: () => getRequest(APIS.GET_ALL_TRANSACTIONS, payload), // ✅ use post

  });

   

  useEffect(() => {
    if (data?.data?.result) {
      console.log('API Result:', data.data.result);
      setTransactions(data.data.result);
    }
  }, [data]);
  console.log('Get setTransactions list ', data);
    // const subscriptionHistoryData = [
    //     {
    //         id: '1',
    //         title: 'Premium Plan',
    //         dateRange: '01 Jan 2024 - 01 Jan 2025',
    //         price: '₹499/month',
    //         invoiceNumber: '2015479100',
    //         status: 'Active',
    //     },
    //     {
    //         id: '2',
    //         title: 'Basic Plan',
    //         dateRange: 'Jan 01, 2024 – Jan 31, 2024',
    //         price: '₹499/month',
    //         invoiceNumber: '2015479100',
    //         status: 'Expired',
    //     },
    // ];

    const BackButton = () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <AppImage source={Images.back} style={styles.backIcon} />
        </TouchableOpacity>
    );

    const renderSubscriptionCard = ({ item }) => (
        <View style={styles.cardContainer}>
            {/* Status Top Right */}
           <View style={styles.statusContainer}>
    <View
    style={[
        styles.statusContainer,
        item.status === 'Expired' && styles.expiredStatusMargin,
    ]}
>
    <View style={styles.statusRow}>
        <AppText style={styles.statusText}>
            {item.status}
        </AppText>
     <View style={[styles.greenDot,{backgroundColor:item.status === 'Expired' ? '#FF0000':'#1CB219'}]} />
    </View>
</View>

</View>


            {/* Info Left */}
            <View style={styles.cardInfo}>
                <AppText style={styles.cardTitle}>{item.subscription_plan_name}</AppText>
                <AppText style={styles.cardText}>{`${moment(item.createdAt).format('MMM DD, YYYY')} - ${moment(item.expiry_date).format('MMM DD, YYYY')}`}
</AppText>
                <AppText style={styles.cardText}>{item.plan_price}</AppText>
                <AppText style={styles.cardText}>Invoice: {item.invoice_number}</AppText>
            </View>

            {/* Download Invoice Button */}
            <TouchableOpacity style={styles.downloadContainer}>
                <AppText style={styles.downloadText}>Download Invoice</AppText>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <View style={styles.backButtonContainer}>
                        <BackButton />
                    </View>
                    <AppText style={styles.headerText}>Subscription History</AppText>
                </View>

                {/* FlatList with cards */}
                <FlatList
                    data={transactions}
                    renderItem={renderSubscriptionCard}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
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
        marginVertical: 20,
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
        marginBottom: Platform.OS === 'android' ? moderateScale(10) : 0,
    },
    headerText: {
        fontWeight: '400',
        fontSize: 16,
        color: '#ffff',
        marginBottom: Platform.OS === 'android' ? moderateScale(0) : moderateScale(8),
    },

    cardContainer: {
        backgroundColor: '#241A52',
        borderRadius: 14,
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 16,
        position: 'relative',
    },
    statusContainer: {
        position: 'absolute',
        top: 12,
        right: 10,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color:'#fff',
        fontStyle:'italic'
    },
    cardInfo: {
        alignItems: 'flex-start',
    },
    cardTitle: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
        marginBottom: 8,
    },
    cardText: {
        fontSize: 12,
        color: '#fff',
        marginBottom: 4,
        fontWeight: '400',


    },
    downloadContainer: {
        position: 'absolute',
        bottom: 12,
        right: 16,
    },
    downloadText: {
        color: '#9FA3F2',
        fontSize: 13,
        textDecorationLine: 'underline',
        fontWeight: '500',
    },
   statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
},

greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4, // Half of width/height for perfect circle
    backgroundColor: '#1CB219', // Green color
    marginLeft: 6,
},
expiredStatusMargin: {
    marginRight: 1, // You can adjust this value
},

});

export default SubscriptionHistory;
