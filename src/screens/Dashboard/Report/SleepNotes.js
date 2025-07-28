import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import * as Progress from 'react-native-progress';
import { Images } from '@assets/index';

const { width } = Dimensions.get('window');

const SleepNotes = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      const sleepNoteData = {
        date: '27 June 2025',
        sleepNotes: [
          {
            question: 'How would you describe your overall mood today?',
            answer: 'Sad',
          },
          {
            question: 'Which of these did you do in the last 3–4 hours?',
            answer: 'Workout',
          },
          {
            question: 'How was your sleep environment?',
            answer: 'Cold Room',
          },
          {
            question: 'Additional Notes',
            answer: 'Having a headache, and got up in between the sleep.',
            type: 'notes',
          },
        ],
        sleepReport: {
          sleepScore: 85,
          sleepTime: '23:00 PM',
          wakeUpTime: '07:12 AM',
          totalTime: '7 h 40 min',
          awakeCount: 4,
        },
      };

      setData(sleepNoteData);
    };

    fetchData();
  }, []);

  if (!data) return null; // Show loading indicator in real case

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.dateText}>{data.date}</Text>
      <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Sleep Notes</Text>

      <View style={styles.card}>
        {data.sleepNotes.map((item, index) => (
          <View key={index} style={{ marginBottom: item.type === 'notes' ? 0 : 12 }}>
            {item.type === 'notes' ? (
              <>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.question}>{item.question}</Text>
                  <TouchableOpacity style={styles.editIcon}>
                    <Image source={Images.notes} style={{ height: 18, width: 18 }} />
                  </TouchableOpacity>
                </View>
                <View style={styles.notesBox}>
                  <Text style={styles.notesText}>{item.answer}</Text>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.question}>{item.question}</Text>
                <Text style={styles.answer}>{item.answer}</Text>
              </>
            )}
          </View>
        ))}
      </View>

      <View style={[styles.reportHeader, { marginTop: 20 }]}>
        <Text style={styles.sectionTitle}>Sleep Report</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { marginTop: 10 }]}>
        <View style={styles.reportBody}>
      <View style={styles.scoreCircle}>
  {/* Circular Progress */}
  <Progress.Circle
    size={94}
    progress={data.sleepReport.sleepScore / 100}
    thickness={8}
    color="#7E7AFF"
    unfilledColor="#2E2563"
    borderWidth={0}
    showsText={false} // hide default text
  />

  {/* Custom Text Inside Circle */}
  <View style={styles.circleTextContainer}>
        <Text style={styles.scoreLabel}>Sleep Score</Text>
    <Text style={styles.scoreText}>{data.sleepReport.sleepScore}</Text>
  </View>
</View>
<View style={styles.reportStatsContainer}>
  <View style={styles.reportRow}>
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>Sleep Time</Text>
      <Text style={styles.statValue}>{data.sleepReport.sleepTime}</Text>
    </View>
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>Wake up time</Text>
      <Text style={styles.statValue}>{data.sleepReport.wakeUpTime}</Text>
    </View>
  </View>

  <View style={styles.reportRow}>
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>Total Time</Text>
      <Text style={styles.statValue}>{data.sleepReport.totalTime}</Text>
    </View>
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>Awake Count</Text>
      <Text style={styles.statValue}>{data.sleepReport.awakeCount}</Text>
    </View>
  </View>
</View>

        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#160E3B',
    paddingHorizontal: 16,
  },
  dateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: moderateScale(20),
  },
  card: {
    backgroundColor: '#22194D',
    borderRadius: 16,
    padding: 16,
    marginTop: moderateScale(10),
  },
  sectionTitle: {
    color: '#D9C3FF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: moderateScale(10),
  },
  question: {
    color: '#B9B9D9',
    fontSize: 13,
    marginTop: 10,
  },
  answer: {
    color: '#9F67FF',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  notesBox: {
    backgroundColor: '#2E2563',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    position: 'relative',
  },
  notesText: {
    color: '#B9B9D9',
    fontSize: 13,
    height:moderateScale(85),
    width:moderateScale(297)
  },
  editIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    padding: 4,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAll: {
    color: '#9F67FF',
    fontSize: 13,
    fontWeight: '500',
  },
  reportBody: {
    flexDirection: 'row',
    marginTop: 16,
  },
 
  gradientCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
 
scoreCircle: {
  width: 94,
  height: 94,
  justifyContent: 'center',
  alignItems: 'center',
},

circleTextContainer: {
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
},

scoreText: {
  color: '#fff',
  fontSize: 18,
  fontWeight: '600',
},



scoreLabel: {
  fontSize: 10,
  color: '#fff',
  marginTop: 6,
},

//   reportStats: {
//     flex: 2,
//     paddingLeft: 16,
//   },
  
  statLabel: {
    color: '#B9B9D9',
    fontSize: 12,
    marginBottom: 2,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  reportStatsContainer: {
  flex: 1,
  justifyContent: 'space-between',
  marginLeft: moderateScale(10),
},

reportRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: moderateScale(12),
},

statBox: {
  width: '47%',
},

});

export default SleepNotes;
