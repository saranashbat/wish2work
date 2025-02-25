import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, Modal } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons

// Get window dimensions for responsive layout
const { width, height } = Dimensions.get('window');

const StudentProfile = ({route, navigation}) => {
  const [student, setStudent] = useState(null);
  const [departmentName, setDepartmentName] = useState('');
  const [programName, setProgramName] = useState('');
  const [description, setDescription] = useState(''); // Initialize description state
  const [showInfoModal, setShowInfoModal] = useState(false);
  const auth = getAuth();
  
  // Get email and extract student ID (part before '@')
  const email = auth.currentUser?.email;
  const studentId = email ? email.split('@')[0] : null;
  
  useEffect(() => {
    if (route.params?.updatedDescription) {
      setDescription(route.params.updatedDescription);
    }
  }, [route.params?.updatedDescription]);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!studentId) return;
      try {
        // Fetch student data using extracted student ID
        const studentRes = await axios.get(`https://wish2work.onrender.com/api/students/${studentId}`);
        const studentData = studentRes.data;
        setStudent(studentData);

        // Set the description from the student data
        setDescription(studentData.personal_description || 'No description provided'); // Set description

        // Fetch program and department data
        const programRes = await axios.get(`https://wish2work.onrender.com/api/programs/${studentData.program_id}`);
        setProgramName(programRes.data.name); // Set the program name
        const departmentRes = await axios.get(`https://wish2work.onrender.com/api/departments/${programRes.data.department_id}`);
        setDepartmentName(departmentRes.data.name);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, [studentId]);

  // Show loading spinner while fetching data
  if (!student) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2C2F6B" />
      </View>
    );
  }

  const handleLogout = () => {
    signOut(auth).catch((error) => {
      console.error('Error signing out:', error);
    });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f4f4f4' }}>
      <View style={{ 
        alignItems: 'center', 
        backgroundColor: '#2C2F6B', 
        paddingVertical: height * 0.03, 
        borderBottomLeftRadius: 30, 
        borderBottomRightRadius: 30,
        // Shadow properties for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        // Elevation for Android
        elevation: 5,
      }}>
        <Image 
          source={require('../../../assets/logo.png')} 
          style={{ 
            marginRight: 20, 
            alignSelf: 'flex-end', 
            width: width * 0.4, 
            height: height * 0.08, 
            resizeMode: 'contain' 
          }} 
        />
        <Text style={{ 
          marginBottom: 10, 
          marginLeft: width * 0.08, 
          alignSelf: 'flex-start', 
          color: 'white', 
          fontSize: width * 0.06, 
          fontWeight: 'bold', 
        }}>
          {student.first_name} {student.last_name}
        </Text>
        <Text style={{ 
          marginBottom: 10, 
          marginLeft: width * 0.08, 
          alignSelf: 'flex-start', 
          color: 'white', 
          fontSize: width * 0.045 
        }}>
          {studentId}
        </Text>
        <Text style={{ 
          marginBottom: 10, 
          marginLeft: width * 0.08, 
          alignSelf: 'flex-start', 
          color: 'white', 
          fontSize: width * 0.045 
        }}>
          {departmentName}
        </Text>
        <TouchableOpacity 
          style={{ 
            marginTop: 10, 
            backgroundColor: 'rgba(255, 255, 255, 0.3)', // Transparent white button
            paddingHorizontal: 20, 
            paddingVertical: 5, 
            borderRadius: 5 
          }}
        >
          <Text style={{ color: 'white' }}>Settings</Text>
        </TouchableOpacity>
      </View>
      <View style={{ padding: width * 0.05 }}>
        <InfoRow icon="🎓" text={programName} />
        <InfoRow icon="✉️" text={student.email} />
        <InfoRow icon="📞" text={student.phone_number || 'N/A'} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <InfoRow icon="⭐" text={student.average_rating ? `${(student.average_rating || 0).toFixed(1)}/5.0` : 'No rating yet'} />
          <TouchableOpacity onPress={() => setShowInfoModal(true)}>
            <FontAwesome name="info-circle" size={22} color="#2C2F6B" style={{ marginLeft: 10 }} />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10}}>About</Text>
          <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => navigation.navigate('EditAbout', { description: student.personal_description, studentId: studentId })}>
              <FontAwesome name="edit" size={23} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={{ 
            backgroundColor: 'white', 
            padding: 10, 
            borderRadius: 10, 
            marginTop: 5,
            minHeight: height * 0.08, // Adjust minimum height to maintain layout consistency
          }}
        >
          <Text 
            style={{ 
              fontSize: 16, 
              color: description ? 'black' : '#888', // Lighter text color for empty description
              fontStyle: description ? 'normal' : 'italic', // Italics for 'No description' case
            }}
          >
            {description}
          </Text>
        </ScrollView>

        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>YOUR COURSES</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>YOUR SKILLS</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Availability', {studentId: studentId })} 
        style={styles.button}><Text style={styles.buttonText}>YOUR AVAILABILITY</Text></TouchableOpacity>

        
        {/* Logout Button with icon and text */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={22} color="white" style={{ marginRight: 10 }} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Info Modal */}
      <Modal
        visible={showInfoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rating Information</Text>
            <Text style={styles.modalText}>This is your average rating based on feedback from employers. It reflects your overall performance and reliability.</Text>
            <TouchableOpacity onPress={() => setShowInfoModal(false)} style={styles.closeButton}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const InfoRow = ({ icon, text }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5, marginLeft: 10 }}>
    <Text style={{ fontSize: 18 }}>{icon}</Text>
    <Text style={{ marginLeft: 10, fontSize: 16 }}>{text}</Text>
  </View>
);

const styles = {
  button: {
    backgroundColor: '#2C2F6B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF6F61',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: width * 0.8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#2C2F6B',
    padding: 10,
    borderRadius: 5,
  },
};

export default StudentProfile;
