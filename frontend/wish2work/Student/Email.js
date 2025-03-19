import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

const EmailScreen = () => {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Fake send email function
  const sendEmail = () => {
    if (!recipient || !subject || !message) {
      Alert.alert('Error', 'Recipient, subject, and message cannot be empty.');
      return;
    }

    // Simulate a successful email send with a timeout
    setTimeout(() => {
      Alert.alert('Success', 'Email sent successfully!');
      setRecipient('');
      setSubject('');
      setMessage('');
    }, 1000); // Fake a delay of 1 second to simulate email sending
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.header}>Send Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter recipient email"
        value={recipient}
        onChangeText={setRecipient}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter subject"
        value={subject}
        onChangeText={setSubject}
      />
      <TextInput
        style={[styles.input, styles.messageInput]}
        placeholder="Enter your message"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <TouchableOpacity onPress={sendEmail} style={styles.button}>
        <Text style={styles.buttonText}>Send Email</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: width * 0.05, // 5% padding based on screen width
    backgroundColor: '#F2F7FA',
  },
  logo: {
    width: width * 0.55, height: width * 0.2,
    alignSelf: 'center',
    marginBottom: height * 0.05, // 5% margin from the top of the screen
  },
  header: {
    fontSize: width * 0.07, // 7% of screen width
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.03, // 3% margin
  },
  input: {
    backgroundColor: '#FFF',
    padding: width * 0.04, // 4% padding based on screen width
    borderRadius: 10,
    fontSize: width * 0.045, // 4.5% of screen width for input text size
    marginBottom: height * 0.02, // 2% margin between inputs
    borderWidth: 1,
    borderColor: '#7A9FD9',
  },
  messageInput: {
    height: height * 0.15, // 15% of screen height for message input
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#130160',
    padding: width * 0.05, // 5% padding based on screen width
    borderRadius: 10,
    marginTop: height * 0.03, // 3% margin from the previous element
  },
  buttonText: {
    color: '#FFF',
    fontSize: width * 0.045, // 4.5% of screen width for button text size
    textAlign: 'center',
  },
});

export default EmailScreen;
