import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Dimensions, Image } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import { auth } from '../../config/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../../config/auth'; // Assuming you have a Firebase config file with Firestore initialized

const { width, height } = Dimensions.get('window');

const Register2 = ({ route, navigation }) => {
  const { studentId, email, firstName, lastName } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [major, setMajor] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');  // New state for phone number
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
      alert('Failed to load departments');
    }
  };

  const fetchMajors = async (departmentId) => {
    try {
      const response = await axios.get(`https://wish2work.onrender.com/api/departments/${departmentId}/programs`);
      setMajors(response.data);
    } catch (err) {
      alert('Failed to load majors');
    }
  };

  const handleRegistration = async () => {
    if (!password || !confirmPassword || !department || !major || !phoneNumber) {  // Check if phone number is provided
      alert('All fields are required');
      return;
    }
  
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    setLoading(true);
    try {
      // Step 1: Create the user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Get user object from Firebase
  
      // Step 2: Prepare student data for the database
      const studentData = {
        student_id: studentId,        // studentId passed from the route params
        program_id: major,            // major is the selected program
        first_name: firstName,        // firstName passed from route params
        last_name: lastName,          // lastName passed from route params
        email: email,                 // email passed from route params
        phone_number: phoneNumber,    // Added phone number to the student data
        personal_description: null,   // Assuming no personal description is entered
        average_rating: null,         // Assuming default null rating
        is_active: true,              // Assuming the student is active by default
        created_at: new Date().toISOString(), // Current timestamp for created_at
        updated_at: new Date().toISOString(), // Current timestamp for updated_at
      };
  
      // Step 3: Add the student to the database after successful Firebase registration
      await axios.post('https://wish2work.onrender.com/api/students', studentData);
  
      // Step 4: Add the user's role to the 'user_role' collection in Firestore
      await setDoc(doc(db, 'user_role', user.uid), { role: 'student' });

      // Step 5: Navigate to the Login screen after successful registration
      alert('Registration Successful!');
      navigation.navigate('Login');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false); // Set loading to false after the process is completed
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

      {/* Phone Number Input */}
      <TextInput 
        style={styles.input} 
        placeholder="Phone Number" 
        value={phoneNumber} 
        onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))}  // Allow only numbers
        keyboardType="numeric"  // Set keyboard to numeric for phone number input
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
});

export default Register2;
