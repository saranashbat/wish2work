import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Dimensions, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth } from '../../config/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const Register2 = ({ route, navigation }) => {
  const { studentId, email, firstName, lastName } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [major, setMajor] = useState('');
  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://192.168.56.1:5000/api/departments');
      const filteredDepartments = response.data.filter(dept => dept.department_id >= 4 && dept.department_id <= 8);
      setDepartments(filteredDepartments);
    } catch (err) {
      setError('Failed to load departments');
    }
  };

  const fetchMajors = async (departmentId) => {
    try {
      const response = await axios.get(`http://192.168.56.1:5000/api/departments/${departmentId}/programs`);
      setMajors(response.data);
    } catch (err) {
      setError('Failed to load majors');
    }
  };

  const handleRegistration = async () => {
    setError('');
    if (!password || !confirmPassword || !department || !major) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.navigate('Login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logo.png')} // Path to logo image
          style={styles.logo}
        />
      </View>

      <Text style={styles.title}>Complete Registration</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={department}
          onValueChange={(value) => {
            setDepartment(value);
            fetchMajors(value);
          }}
          style={styles.pickerInner}
        >
          <Picker.Item label="Select Department" value="" color="#888" />
          {departments.map((dept) => (
            <Picker.Item key={dept.department_id} label={dept.name} value={dept.department_id} />
          ))}
        </Picker>
      </View>

      {department ? (
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={major} onValueChange={setMajor} style={styles.pickerInner}>
            <Picker.Item label="Select Major" value="" color="#888" />
            {majors.map((prog) => (
              <Picker.Item key={prog.program_id} label={prog.name} value={prog.program_id} />
            ))}
          </Picker>
        </View>
      ) : null}

      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

      <TouchableOpacity style={styles.button} onPress={handleRegistration} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
      </TouchableOpacity>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: width * 0.05 },
  logoContainer: { alignItems: 'center', marginBottom: height * 0.02 },
  logo: { width: width * 0.7, height: width * 0.3, alignSelf: 'center', marginBottom: height * 0.05 },
  title: { fontSize: width * 0.07, fontWeight: 'bold', marginBottom: height * 0.02, textAlign: 'center' },
  input: { height: height * 0.07, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: width * 0.03, marginBottom: height * 0.02 },
  pickerWrapper: {
    height: height * 0.07,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: height * 0.02,
    overflow: 'hidden', // Ensures the border-radius is applied
    backgroundColor: '#fff', // Ensure the background is white
  },
  pickerInner: {
    height: '100%', // Ensure Picker takes full height of wrapper
    width: '100%',
  },
  button: { backgroundColor: '#130160', paddingVertical: height * 0.02, borderRadius: 8, alignItems: 'center', marginBottom: height * 0.02 },
  buttonText: { color: '#fff', fontSize: width * 0.05, fontWeight: 'bold' },
  backButton: { 
    backgroundColor: '#888', 
    paddingVertical: height * 0.015, 
    paddingHorizontal: width * 0.05, 
    borderRadius: 8, 
    alignSelf: 'flex-start', // Align to the left
    marginTop: height * 0.01, // Small space from Register button
  },
  backButtonText: { 
    color: '#fff', 
    fontSize: width * 0.04, 
    fontWeight: 'bold' 
  },
  error: { color: 'red', textAlign: 'center', marginBottom: height * 0.02 },
});

export default Register2;
