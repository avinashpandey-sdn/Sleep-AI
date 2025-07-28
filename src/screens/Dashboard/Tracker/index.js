import React, {memo, useRef, useCallback, useEffect} from 'react';
import {ImageBackground, View} from 'react-native';
import PreQuestinerSheet from '@components/Sheets/Questiner/PreQuestioner/PreQuestioner';
import QuestinerSheet from '@components/Sheets/Questiner';
import {useNavigation} from '@react-navigation/native';
import {Images} from '@assets/index';

const Index = memo(() => {
  const QuestinerSheetRef = useRef(null);
  const navigation = useNavigation();
  useEffect(() => {
    QuestinerSheetRef.current?.show();
  }, []);

  return (
    <ImageBackground
      source={Images.trackerBackground}
      style={{
        flex: 1,
        resizeMode: 'cover',
        paddingHorizontal: 20,
        paddingTop: 40,
        justifyContent: 'space-between',
      }}>
      <QuestinerSheet
        sheetRef={QuestinerSheetRef}
        type="PRE-SLEEP"
        onClose={() => {
          // QuestinerSheetRef.current?.hide();
          // setTimeout(() => {
          //   navigation.navigate('DashbordStack');
          // }, 0);
        }}
      />
    </ImageBackground>
  );
});

export default Index;
