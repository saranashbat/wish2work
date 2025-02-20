import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Dimensions, Image } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
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

  useEffect(() => {
    if (department) {
      fetchMajors(department);
    }
  }, [department]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://192.168.56.1:5000/api/departments');
      const filteredDepartments = response.data.filter(dept => dept.department_id >= 4 && dept.department_id <= 8);
      setDepartments(filteredDepartments);
      setError(''); // Clear error after successful fetch
    } catch (err) {
      setError('Failed to load departments');
    }
  };

  const fetchMajors = async (departmentId) => {
    try {
      const response = await axios.get(`http://192.168.56.1:5000/api/departments/${departmentId}/programs`);
      setMajors(response.data);
      setError(''); // Clear error after successful fetch
    } catch (err) {
      setError('Failed to load majors');
    }
  };

  const handleRegistration = async () => {
    setError('');  // Reset error message on every registration attempt

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
      setError(''); // Clear error after successful registration
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
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Complete Registration</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Department Selector */}
      <ModalSelector
        data={departments.map((dept) => ({ key: dept.department_id, label: dept.name }))} 
        initValue="Select Department..."
        onChange={(option) => {
          setDepartment(option.key);
          fetchMajors(option.key);
        }}
        style={styles.modalSelector}
        cancelText="Cancel"
      >
        <TextInput 
          style={styles.input}
          value={departments.find(d => d.department_id === department)?.name || 'Select Department...'}
          editable={false}
        />
      </ModalSelector>

      {/* Major Selector */}
      {department ? (
        <ModalSelector
          data={majors.map((prog) => ({ key: prog.program_id, label: prog.name }))} 
          initValue="Select Major..."
          onChange={(option) => setMajor(option.key)}
          style={styles.modalSelector}
          cancelText="Cancel"
        >
          <TextInput 
            style={styles.input}
            value={majors.find(m => m.program_id === major)?.name || 'Select Major...'}
            editable={false}
          />
        </ModalSelector>
      ) : null}

      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Confirm Password" 
        secureTextEntry 
        value={confirmPassword} 
        onChangeText={setConfirmPassword} 
      />

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
  logo: { width: '100%', height: width * 0.3, marginBottom: height * 0.05 },
  title: { fontSize: width * 0.08, fontWeight: 'bold', marginBottom: height * 0.02, textAlign: 'center' },
  input: {
    height: height * 0.07, 
    paddingHorizontal: width * 0.03, 
    marginBottom: height * 0.02,
    borderRadius: 8, 
    backgroundColor: 'transparent',
    borderWidth: 1,  // Add border to input boxes
    borderColor: '#ccc',  // Add border color for input fields
  },
  modalSelector: {
    height: height * 0.07,
    paddingHorizontal: width * 0.003,
    marginBottom: height * 0.02,
    borderRadius: 8, 
    backgroundColor: 'white', 
    borderColor: '#ccc',  // Add border color to modal selector
  },
  button: {
    backgroundColor: '#130160', 
    paddingVertical: height * 0.02, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginBottom: height * 0.02 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: width * 0.05, 
    fontWeight: 'bold' 
  },
  backButton: { 
    backgroundColor: '#888', 
    paddingVertical: height * 0.015, 
    paddingHorizontal: width * 0.05, 
    borderRadius: 8, 
    alignSelf: 'flex-start', 
    marginTop: height * 0.01, 
  },
  backButtonText: { 
    color: '#fff', 
    fontSize: width * 0.04, 
    fontWeight: 'bold' 
  },
  error: { 
    color: 'red', 
    textAlign: 'center', 
    marginBottom: height * 0.02 
  },
});


export default Register2;
