import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

const Register = ({ navigation }) => {
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!studentId || !email || !firstName || !lastName) {
      setError('All fields are required');
      return;
    }
    if (studentId.length !== 8) {
      setError('Student ID must be exactly 8 characters');
      return;
    }
    if (!email.endsWith('@udst.edu.qa')) {
      setError('Email must be a valid university email (@udst.edu.qa)');
      return;
    }
    
    navigation.navigate('Register2', { studentId, email, firstName, lastName });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Register</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput style={styles.input} placeholder="Student ID" keyboardType="numeric" value={studentId} onChangeText={setStudentId} />
      <TextInput style={styles.input} placeholder="University Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: width * 0.05 },
  logo: { width: width * 0.7, height: width * 0.3, alignSelf: 'center', marginBottom: height * 0.05 },
  title: { fontSize: width * 0.07, fontWeight: 'bold', marginBottom: height * 0.05, textAlign: 'center' },
  input: { height: height * 0.07, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: width * 0.05, marginBottom: height * 0.03 },
  button: { backgroundColor: '#130160', paddingVertical: height * 0.02, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: width * 0.05, fontWeight: 'bold' },
  error: { color: 'red', textAlign: 'center', marginBottom: height * 0.02 },
});

export default Register;
