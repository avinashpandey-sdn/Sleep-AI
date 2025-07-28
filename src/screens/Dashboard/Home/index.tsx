import {Images} from '@assets/index';
import CustomHeader from '@components/CustomHeader';
import QuestinerSheet from '@components/Sheets/Questiner';
import SubscriptionSheet from '@components/Sheets/Subscription/SubscriptionSheet';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {setFirstTimeScreenToShow} from '@app/reducers/auth/auth.slice';
import ProfileSetupSheet from '@components/Sheets/ProfileSetup';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {useDispatch, useSelector} from 'react-redux';
import {styles} from './styles';

const dummyArticles = [
  {
    id: '1',
    title: 'The Science of Sleep',
    subtitle: 'how your body and mind recharge every...',
  },
  {
    id: '2',
    title: 'Snoring Decoded',
    subtitle: 'Understand the causes of snoring and ho...',
  },
  {
    id: '3',
    title: 'Sounds That Soothe',
    subtitle: 'How adaptive music and ambient sounds...',
  },
];

const dummyTracks = [
  {id: '1', title: 'Deep Sleep', duration: '13 min'},
  {id: '2', title: 'Deep Sleep', duration: '13 min'},
  {id: '3', title: 'Deep Sleep', duration: '13 min'},
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const QuestinerSheetRef = useRef(null);
  const SubscriptionSheetRef = useRef(null);
  const ProfileSetupSheetRef = useRef(null);

  const AuthData = useSelector(state => state.auth);
  console.log('AuthData>>>>>>>', AuthData);
  useEffect(() => {
    if (AuthData?.firstTimeScreenToShow) {
      QuestinerSheetRef.current?.show();

      setTimeout(() => {
        dispatch(setFirstTimeScreenToShow(false));
      }, 1000);
    }
  }, [AuthData]);

  const MenuItem = ({label, icon, color}) => (
    <View style={styles.menuItem}>
      <View style={[styles.menuIconWrap, {backgroundColor: color}]}>
        <Image source={icon} style={styles.menuIcon} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
  );

  const InfoCard = ({label, value}) => (
    <View style={styles.infoCard}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const SectionWithFlatList = ({title, data, renderItem}) => (
    <View style={{marginVertical: 10}}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  return (
    <ImageBackground source={Images.Homebackground} style={styles.background}>
      <StatusBar barStyle="light-content" backgroundColor={'#160E3B'} />

      <KeyboardAwareScrollView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.container}>
          <CustomHeader
            type="primary"
            userName="Hello, Jenny"
            onHamburgerPress={() => navigation.openDrawer()}
            onNotificationPress={() => console.log('Notification pressed')}
          />

          {/*  artical  */}
          {/* Top Menu */}
          <View style={styles.menuRow}>
            <MenuItem label="Library" icon={Images.library} color="#4CC9F0" />
            <MenuItem
              label="Articles"
              icon={Images.ariticles}
              color="#9A4BFF"
            />
            <MenuItem label="Alarm clock" icon={Images.alarm} color="#80B918" />
            <MenuItem label="Premium" icon={Images.premium} color="#C9184A" />
          </View>

          {/* Sleep Summary */}
          <View style={styles.cardRow}>
            <InfoCard label="Overall Sleep Quality" value="85%" />
            <InfoCard label="Sleep Time" value="23:30-7:00" />
          </View>

          {/* Sleep Status */}
          <View style={styles.statusRow}>
            <Image source={Images.rightIcon} style={styles.rightIcon} />
            <Text style={styles.statusText}>
              Great you slept well last night
            </Text>
          </View>

          {/* Doctor Banner */}
          <View style={styles.bannerCard}>
            <View style={{width: 198, flex: 1}}>
              <Text style={styles.bannerTitle}>Talk To Expert</Text>
              <Text style={styles.bannerText}>
                Book a consultation for tailored sleep insights and expert
                guidance.
              </Text>
              <TouchableOpacity style={styles.bannerButton}>
                <Image source={Images.moon} style={styles.moon} />
                <Text style={{color: '#fff', marginTop: -4}}>Send Request</Text>
              </TouchableOpacity>
            </View>
            <View>
              {/* girlPhoto */}
              <Image source={Images.girlPhoto} style={styles.girlPhoto} />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Expert Recommendations</Text>
          <View style={styles.recommendCard}>
            <Image source={Images.fullMask} style={styles.recommendImg} />
            <View style={{width: 207}}>
              <Text style={styles.recommendTitle}>Smart Sleep Mask</Text>
              <Text style={styles.recommendSub}>
                Use during sleep or naps to reduce snoring and improve sleep.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('DashbordStack', {
                    screen: 'StartTracker',
                  });
                }}>
                <Text style={styles.link}>Connect</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Appointment */}
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              alignContent: 'center',
              marginTop: 24,
            }}>
            <Text style={styles.sectionTitle}>Today's Appointment</Text>
            <Text style={{color: '#F4F3F380', fontWeight: '400', fontSize: 12}}>
              View All
            </Text>
          </View>

          <View style={styles.appointmentCard}>
            <View
              style={{flexDirection: 'row', alignItems: 'center', gap: 7.7}}>
              <Image source={Images.doctor} style={styles.doctor} />

              <View>
                <Text style={styles.appointmentName}>Sahana V</Text>
                <Text style={styles.appointmentRole}>
                  MSc in Clinical Psychology
                </Text>
              </View>
            </View>

            <View style={styles.appointmentDetails}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={Images.calender1} style={styles.appoimentIcon} />
                <Text style={styles.appointmentText}>
                  Sunday 21 August 2025
                </Text>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={Images.clock} style={styles.appoimentIcon} />
                <Text style={styles.appointmentText}>7:30 PM - 8:30 PM</Text>
              </View>
            </View>
          </View>

          {/* Recently Played */}

          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              alignContent: 'center',
              marginTop: 24,
            }}>
            <Text style={styles.sectionTitle}>Recently Played</Text>
            <Text style={{color: '#F4F3F380', fontWeight: '400', fontSize: 12}}>
              View All
            </Text>
          </View>
          <SectionWithFlatList
            // title="Recently Played"
            data={dummyTracks}
            renderItem={({item}) => (
              <View style={styles.trackCard}>
                <Image source={Images.musicCard} style={styles.trackImage} />
                {/* <Text style={styles.trackTitle}>{item.title}</Text>
                <Text style={styles.trackDuration}>{item.duration}</Text> */}
              </View>
            )}
          />

          {/* Recent Articles */}
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              alignContent: 'center',
              marginTop: 24,
            }}>
            <Text style={styles.sectionTitle}>Recent Articles</Text>
            <Text style={{color: '#F4F3F380', fontWeight: '400', fontSize: 12}}>
              View All
            </Text>
          </View>

          {dummyArticles.map(article => (
            <View key={article.id} style={styles.articleCard}>
              <View>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleSubtitle}>{article.subtitle}</Text>
              </View>
              <Image source={Images.share} style={styles.share} />
            </View>
          ))}
        </SafeAreaView>

        {!__DEV__ && (
          <>
            <TouchableOpacity
              style={{borderWidth: 1, padding: 10, borderColor: 'white'}}
              onPress={() => {
                QuestinerSheetRef.current?.show();
              }}>
              <Text style={{color: '#ffff'}}>show Quesiner</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{borderWidth: 1, padding: 10, borderColor: 'white'}}
              onPress={() => {
                ProfileSetupSheetRef.current?.show();
              }}>
              <Text style={{color: '#ffff'}}>Subscription sheet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{borderWidth: 1, padding: 10, borderColor: 'white'}}
              onPress={() => {
                SubscriptionSheetRef.current?.show();
              }}>
              <Text style={{color: '#ffff'}}>Profile Setup sheet</Text>
            </TouchableOpacity>
          </>
        )}
      </KeyboardAwareScrollView>

      <QuestinerSheet
        sheetRef={QuestinerSheetRef}
        type="N-BOARDING"
        onClose={() => {
          QuestinerSheetRef.current?.hide();
          setTimeout(() => {
            SubscriptionSheetRef.current?.show();
          }, 1000);
        }}
      />
      <SubscriptionSheet
        sheetRef={SubscriptionSheetRef}
        onClose={() => {
          SubscriptionSheetRef.current?.hide();
          setTimeout(() => {
            ProfileSetupSheetRef.current?.show();
          }, 1000);
        }}
      />

      <ProfileSetupSheet
        sheetRef={ProfileSetupSheetRef}
        onClose={() => {
          ProfileSetupSheetRef.current?.hide();
        }}
      />
    </ImageBackground>
  );
};

export default HomeScreen;

{
  /* Second Header with 3 icons */
}
{
  /* 
      <CustomHeader
        type="second"
        firstIcon={<Icon name="arrow-back" size={24} />}
        secondIcon={<Text style={{fontSize: 18}}>Title</Text>}
        lastIcon={<Icon name="settings-outline" size={24} />}
      />
      */
}

{
  /* Second Header with center only */
}
{
  /* 
      <CustomHeader
        type="second"
        firstIcon={<Icon name="arrow-back" size={24} />}
        secondIcon={<Text style={{fontSize: 18}}>Title</Text>}
      />
      */
}
