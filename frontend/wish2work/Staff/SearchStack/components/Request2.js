import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, ScrollView } from 'react-native';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Request2({ route, navigation }) {
  const { 
    studentId, 
    staffId, 
    selectedTimeRange, 
    first_name, 
    last_name, 
  } = route.params;

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!title) {
      Alert.alert('Error', 'Title is required!');
      return;
    }

    try {
      const requestPayload = {
        staff_id: staffId,
        student_id: studentId,
        start_time: selectedTimeRange.startTime,
        end_time: selectedTimeRange.endTime,
        message: message,
        status: 'Pending',
        title: title,
        availability_date: selectedTimeRange.yearMonthDate,
      };

      const response = await axios.post('https://wish2work.onrender.com/api/requests', requestPayload);
      if (response.status === 201) {
        await axios.delete(`https://wish2work.onrender.com/api/availability/${selectedTimeRange.availabilityId}`);

        Alert.alert('Success', 'Request submitted successfully!');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={30}
          color="#4A90E2"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Create Request</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Request for {first_name} {last_name}</Text>

          <Text style={styles.label}>Selected Time</Text>
          <View style={styles.timeRangeContainer}>
            {/* Displaying the selected full month, day of the month, and time range */}
            <Text style={styles.timeRange}>
              {selectedTimeRange.dayOfWeek}, {selectedTimeRange.formattedDate} - {'\n'}
              {format(parseISO(selectedTimeRange.startTime), 'hh:mm a')} to {format(parseISO(selectedTimeRange.endTime), 'hh:mm a')}
            </Text>
          </View>

          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Meeting Request"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Message (Optional)</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Describe the purpose of the meeting..."
            value={message}
            onChangeText={setMessage}
            multiline
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Request</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    paddingRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C2F6B',
    textAlign: 'center',
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  timeRangeContainer: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%'
  },
  timeRange: {
    fontSize: 16,
    color: '#2C2F6B',
    fontWeight: '500',
  },
  titleInput: {
    height: 60,
    width: '100%',
    borderColor: '#eeeeee',
    borderWidth: 2,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F9F9F9',
  },
  input: {
    height: 45,
    borderColor: '#eeeeee',
    borderWidth: 2,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F9F9F9',
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2C2F6B',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
