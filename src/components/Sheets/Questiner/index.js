import {getRequest, postRequest} from '@api/apiService';
import {APIS} from '@api/apiSheet';
import {Images} from '@assets/index';
import AppDropDown from '@components/AppDropDown';
import AppImage from '@components/AppImage';
import {APP_COLORS} from '@constants/color';
import {useMutation, useQuery} from '@tanstack/react-query';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import * as Progress from 'react-native-progress';
import {moderateScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {showError, showSuccess} from 'utils/alerts';

const QuestinerSheet = ({sheetRef, item = {}, onClose, type = null}) => {
  console.log('QuestinerSheet item', type);
  const [questionsData, setQuestionsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questionHistory, setQuestionHistory] = useState([]);

  const AuthData = useSelector(state => state.auth);

  const currentQuestion = questionsData[currentIndex];
  console.log('questionsData>>>>>>>>', questionsData);
  const {isPending, error, data} = useQuery({
    queryKey: ['questenerList'],
    queryFn: () =>
      getRequest(
        `${APIS.GET_QUESTINER_LIST}?limit=0&page =1&searchText=&questionFor=${type}`,
      ),
  });

  console.log('Get Questiner list ', data);
  const sendUserQuestionerAnswer = useMutation({
    mutationFn: payload =>
      postRequest(APIS.POST_QUESTINER_LIST_ANSWER, payload),
    onSuccess: data => {
      console.log('send questiner response:', data);
      if (data?.success) {
        onClose();
        showSuccess('Success', data?.message);
      } else {
        showError('Error', data?.message);
      }
    },
    onError: error => {
      console.error('Error log api', error);
    },
  });

  useEffect(() => {
    if (data?.data) {
      setQuestionsData(data.data?.result);
    }
  }, [data]);

  function formatUserAnswers(mainArray, userAnswers) {
    const result = [];

    for (const question of mainArray) {
      const questionId = question._id;
      const userAnswer = userAnswers[questionId];

      if (userAnswer !== undefined) {
        const answer =
          typeof userAnswer === 'object' && userAnswer !== null
            ? userAnswer.option
            : userAnswer;

        result.push({
          questionId,
          question: question.question,
          answer,
        });
      }
    }

    return result;
  }

  const handleNext = () => {
    const currentQuestion = questionsData[currentIndex];
    const currentAnswer = answers[currentQuestion?._id];

    if (
      currentAnswer === undefined ||
      currentAnswer === null ||
      (typeof currentAnswer === 'string' && currentAnswer.trim() === '')
    ) {
      Alert.alert('Alert', 'Please answer the question before proceeding.');
      return;
    }

    let nextIndex = currentIndex + 1;

    if (
      currentQuestion?.isDependent &&
      currentQuestion?.skipOptionFor?.length
    ) {
      const answerToCheck =
        typeof currentAnswer === 'object'
          ? currentAnswer.option
          : currentAnswer;

      const shouldSkip = currentQuestion.skipOptionFor.includes(answerToCheck);

      if (shouldSkip && currentQuestion.noOfSkipQuestion) {
        nextIndex += currentQuestion.noOfSkipQuestion;
      }
    }

    setQuestionHistory(prev => [...prev, currentIndex]);

    if (nextIndex < questionsData.length) {
      setCurrentIndex(nextIndex);
    } else {
      const formattedAnswers = formatUserAnswers(questionsData, answers);
      const payload = {
        assessments: formattedAnswers,
        patientId: AuthData?.userLogId,
        questionFor: 'ON-BOARDING',
      };
      sendUserQuestionerAnswer.mutate(payload);
    }
  };

  const handleBack = () => {
    if (questionHistory.length > 0) {
      const prevHistory = [...questionHistory];
      const lastVisitedIndex = prevHistory.pop();

      setQuestionHistory(prevHistory);
      setCurrentIndex(lastVisitedIndex);
    }
  };

  const handleAnswerChange = value => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion._id]: value,
    }));
  };

  const renderInput = () => {
    switch (currentQuestion?.type) {
      case 'text':
        return (
          <View>
            <Text style={styles.questnerHeading}>
              {currentQuestion?.question}
            </Text>
            <View style={styles.input}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your answer"
                placeholderTextColor={APP_COLORS.PLACEHOLDER_TEXT_COLOR}
                value={answers[currentQuestion._id] || ''}
                onChangeText={handleAnswerChange}
              />
            </View>
          </View>
        );
      case 'radio':
        return (
          <View>
            <Text style={styles.questnerHeading}>
              {currentQuestion?.question}
            </Text>
            <View>
              {currentQuestion.options.map(option => (
                <TouchableOpacity
                  key={option._id}
                  onPress={() => handleAnswerChange(option.option)}
                  style={{
                    borderWidth: 1,
                    borderColor: '#FFFFFF0D',
                    flexDirection: 'row',
                    padding: moderateScale(17),
                    borderRadius: 100,
                    marginBottom: moderateScale(16),
                    backgroundColor: '#FFFFFF08',
                  }}>
                  <Text
                    style={{
                      fontWeight: '500',
                      fontSize: 14,
                      color: '#FFFFFF',
                      flex: 1,
                    }}>
                    {option.option}
                  </Text>
                  <View
                    style={{
                      width: moderateScale(16),
                      height: moderateScale(16),
                    }}>
                    <AppImage
                      source={
                        answers[currentQuestion._id] === option.option
                          ? Images.radioOn
                          : Images.radioOff
                      }
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 'dropdown':
        return (
          <View>
            <Text style={styles.questnerHeading}>
              {currentQuestion?.question}
            </Text>

            <View style={styles.dropdown}>
              <AppDropDown
                data={currentQuestion?.options}
                value={answers[currentQuestion._id] || ''}
                setValue={itemValue => handleAnswerChange(itemValue)}
                labelField="option"
                searchEnabled={false}
                valueField="_id"
                dropDownStyle={styles.input}
                placeholderText={'Select Gender'}
              />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const ProgressHeader = ({current = 1, total = 12, onSkip}) => {
    const progressValue = current / total;

    return (
      <View style={styles.progressHeaderContainer}>
        <Progress.Bar
          progress={progressValue}
          width={223}
          color="#5524A9"
          unfilledColor="#FFFFFF1A"
          borderWidth={0}
          height={6}
          borderRadius={10}
          useNativeDriver
        />
        <Text style={styles.pageText}>{`${current}/${total}`}</Text>

        <TouchableOpacity onPress={onSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ActionSheet ref={sheetRef} containerStyle={styles.actionContainer}>
      <ImageBackground source={Images.background} style={styles.container}>
        <ProgressHeader
          current={currentIndex + 1 || 1}
          total={data?.data?.result?.length || 5}
          onSkip={() => onClose()}
        />
        <KeyboardAwareScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.formBackground}>
            <View style={{alignItems: 'center'}}>
              <AppImage source={Images.questinerOne} style={styles.inputIcon} />
            </View>
            {renderInput()}
            <View style={styles.navigationContainer}>
              {currentIndex > 0 && (
                <TouchableOpacity
                  onPress={handleBack}
                  style={[styles.button, {marginRight: 16}]}>
                  <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={handleNext} style={styles.button}>
                <Text style={styles.buttonText}>
                  {currentIndex === questionsData.length - 1
                    ? 'Finish'
                    : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  actionContainer: {backgroundColor: 'black', height: '100%'},
  background: {},
  container: {
    height: '100%',
  },
  progressHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    backgroundColor: 'transparent',
  },
  pageText: {
    color: '#FFFFFF',
    marginLeft: 10,
    marginRight: 'auto',
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    marginTop: moderateScale(42),
  },
  formBackground: {
    width: moderateScale(327),
    padding: moderateScale(22),
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: APP_COLORS.BORDER_COLOR,
    borderRadius: 40,
    marginBottom: 50,
  },
  inputIcon: {
    width: moderateScale(127),
    height: moderateScale(127),
  },
  textInput: {
    color: '#fffff',
  },
  questnerHeading: {
    fontSize: 20,
    fontWeight: '400',
    color: APP_COLORS.WHITE,
    textAlign: 'center',
    marginBottom: moderateScale(28),
  },
  button: {
    backgroundColor: '#6832C4',
    borderRadius: 100,
    height: moderateScale(50),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#AB9BDD',
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  buttonText: {
    fontWeight: '400',
    fontSize: 14,
    color: '#FFFFFF',
  },
  navigationContainer: {
    marginTop: moderateScale(45),
    flexDirection: 'row',
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
  },
  input: {
    borderWidth: 1,
    borderColor: APP_COLORS.TEXT_INPUT_BORDER_COLOR,
    borderRadius: 100,
    alignItems: 'center',
    flexDirection: 'row',
    height: moderateScale(50),
    paddingLeft: moderateScale(18),
    backgroundColor: '#FFFFFF0A',
    color: 'white',
  },
});

export default QuestinerSheet;
