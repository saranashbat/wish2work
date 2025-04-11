import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Alert, Dimensions } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import { auth } from '../config/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/auth';

const { width, height } = Dimensions.get('window');

const AddStaff2Screen = ({ route, navigation }) => {
  const { staffId, email, firstName, lastName } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [major, setMajor] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);

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
      const response = await axios.get('https://wish2work.onrender.com/api/departments');
      const filteredDepartments = response.data.filter(dept => dept.department_id >= 4 && dept.department_id <= 8);
      setDepartments(filteredDepartments);
    } catch (err) {
      Alert.alert('Error', 'Failed to load departments');
    }
  };

  const fetchMajors = async (departmentId) => {
    try {
      const response = await axios.get(`https://wish2work.onrender.com/api/departments/${departmentId}/programs`);
      setMajors(response.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load majors');
    }
  };

  const handleRegistration = async () => {
    if (!password || !confirmPassword || !department || !major || !phoneNumber) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const studentData = {
        staff_id: staffId,
        program_id: major,
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phoneNumber,
        personal_description: null,
        average_rating: null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await axios.post('https://wish2work.onrender.com/api/staff', staffData);
      await setDoc(doc(db, 'user_role', user.uid), { role: 'staff' });

      Alert.alert('Success', 'Registration Successful!');
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Complete The Registration</Text>
      <Text style={styles.subtitle}>Please fill in the details below</Text>

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
        placeholder="Phone Number" 
        value={phoneNumber} 
        onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))}  
        keyboardType="numeric"  
      />

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

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: width * 0.05, backgroundColor: '#F5F7FA' },
  title: { fontSize: width * 0.07, fontWeight: 'bold', textAlign: 'center', marginBottom: height * 0.01, color: '#1E1E1E' },
  subtitle: { fontSize: width * 0.04, textAlign: 'center', marginBottom: height * 0.03, color: '#666' },
  input: {
    height: height * 0.065,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: width * 0.04,
    backgroundColor: '#FFF',
    marginBottom: height * 0.018,
    fontSize: width * 0.035,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  modalSelector: { marginBottom: height * 0.018 },
  button: {
    backgroundColor: '#130160',
    paddingVertical: height * 0.018,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  buttonText: { color: '#FFF', fontSize: width * 0.045, fontWeight: '600' },
  backButton: {
    backgroundColor: '#888',
    paddingVertical: height * 0.015,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  backButtonText: { color: '#FFF', fontSize: width * 0.04, fontWeight: 'bold' },
});

export default AddStaff2Screen;
