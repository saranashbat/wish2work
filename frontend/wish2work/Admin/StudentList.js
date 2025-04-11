import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';

const StudentList = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch students from API
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('https://wish2work.onrender.com/api/students');
      const data = await response.json();

      console.log("Fetched student data:", data); // Debugging API response

      if (Array.isArray(data)) {
        setStudents(data); // Only set if data is an array
      } else {
        console.error("Unexpected API response format:", data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a student
  const deleteStudent = async (studentId) => {
    try {
      const response = await fetch(`https://wish2work.onrender.com/api/students/${studentId}`, { 
        method: 'DELETE' 
      });

      if (response.ok) {
        setStudents((prevStudents) => prevStudents.filter(student => student.student_id !== studentId));
      } else {
        Alert.alert('Error', 'Could not delete student.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error while deleting student.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Add New Student Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddStudentScreen')}>
        <Text style={styles.buttonText}>+ Add New Student</Text>
      </TouchableOpacity>

      {/* Loading Indicator */}
      {loading && <Text style={styles.debugText}>Loading students...</Text>}

      {/* Display message if no students found */}
      {!loading && students.length === 0 ? (
        <Text style={styles.debugText}>No students found. Check API response.</Text>
      ) : null}

      {/* Student List */}
      <FlatList
        data={students}
        keyExtractor={(item) => item.student_id?.toString()} // Ensure correct key
        renderItem={({ item }) => (
          <View style={styles.studentCard}>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{item.first_name} {item.last_name}</Text>
              <Text style={styles.studentEmail}>{item.email}</Text>
              <Text style={styles.studentPhone}>📞 {item.phone_number}</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteStudent(item.student_id)}>
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4' },
  addButton: { backgroundColor: '#130160', padding: 15, borderRadius: 8, marginBottom: 15, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  studentCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 15, 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 3, 
    marginBottom: 10 
  },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  studentEmail: { fontSize: 14, color: '#666' },
  studentPhone: { fontSize: 14, color: '#666', marginTop: 4 },
  deleteButton: { backgroundColor: 'red', padding: 10, borderRadius: 5, alignItems: 'center' },
  debugText: { textAlign: 'center', marginTop: 20, color: 'red', fontSize: 16 }
});

export default StudentList;
