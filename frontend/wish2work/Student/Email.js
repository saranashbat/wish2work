import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const EmailScreen = () => {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const sendEmail = async () => {
    if (!recipient || !subject || !message) {
      Alert.alert('Error', 'Recipient, subject, and message cannot be empty.');
      return;
    }

    const emailData = {
      recipient: recipient,
      subject: subject,
      message: message,
    };

    try {
      const response = await axios.post('https://wish2work.onrender.com/send-email', emailData);
      Alert.alert('Success', response.data.message);
      setRecipient('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to send email.');
    }
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F2F7FA',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#7A9FD9',
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#130160',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default EmailScreen;
