import {Images} from '@assets/index';
import AppButton from '@components/AppButton';
import AppImage from '@components/AppImage';
import AppText from '@components/AppText';
import OnboardingFeatureSheet from '@components/Sheets/OnboardingFeatureSheet';
import constants from '@constants/index';
import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import styles from './style';
const {appFeature} = constants;

export type AppFeatureType = {
  id: number;
  image: any;
};

const OnboardingTwo: React.FC = () => {
  const showOnboardingFeatureSheetRef = useRef(null);
  const navigation = useNavigation();
  const [selectedItem, setSelectedItem] = useState({});

  const Header = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: Platform.OS == 'android' && moderateScale(16),
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <AppImage
            source={Images.back}
            style={{width: moderateScale(30), height: moderateScale(30)}}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('AuthOption')}>
          <AppText style={{fontWeight: '400', fontSize: 14, color: '#FFFFFF'}}>
            Skip
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFeatureItem = (item: AppFeatureType) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          setSelectedItem(item);
          showOnboardingFeatureSheetRef.current?.show();
        }}>
        <Image
          source={item?.image}
          style={styles.featureImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };
  return (
    <ImageBackground source={Images.background} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Header />

        <View style={styles.content}>
          <Text style={styles.title}>Discover Smarter Sleep</Text>
          <Text style={styles.subtitle}>
            Click on each icon to understand how Premier Healthcare Technologies
            can give you full support when you need it most.
          </Text>

          {/* feature */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {/* left Side */}
            <View>
              <FlatList
                data={appFeature}
                renderItem={({item}) =>
                  item.id % 2 != 0 && renderFeatureItem(item)
                }
                keyExtractor={item => item.id}
              />
            </View>

            {/* right Side */}
            <View style={{marginTop: moderateScale(75)}}>
              <FlatList
                data={appFeature}
                renderItem={({item}) =>
                  item.id % 2 == 0 && renderFeatureItem(item)
                }
                keyExtractor={item => item.id}
              />
            </View>
          </View>

          <View style={styles.bottomContainer}>
            <AppButton
              btnText={'Next'}
              btnStyle={styles.button}
              btnTextStyle={styles.buttonText}
              onPress={() => {
                navigation.navigate('AuthOption');
              }}
            />
          </View>
        </View>
      </SafeAreaView>
      <OnboardingFeatureSheet
        sheetRef={showOnboardingFeatureSheetRef}
        item={selectedItem}
        onClose={() => {
          navigation.navigate('AuthOption');
          showOnboardingFeatureSheetRef.current?.hide();
        }}
      />
    </ImageBackground>
  );
};

export default OnboardingTwo;
