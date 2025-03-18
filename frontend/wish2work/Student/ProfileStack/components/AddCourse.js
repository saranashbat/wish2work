import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

const AddCourse = ({route, navigation}) => {
  const { studentId, existingCourses } = route.params;
  const [availableCourses, setAvailableCourses] = useState([]);
  const [addedCourses, setAddedCourses] = useState(new Set(existingCourses.map(course => course.course_id)));

  // Fetching all available courses
  const fetchCourses = async () => {
    try {
      const response = await axios.get('https://wish2work.onrender.com/api/courses');
      setAvailableCourses(response.data);
    } catch (error) {
      console.error('Error fetching available courses:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddCourse = async (courseId) => {
    try {
      const response = await axios.post('https://wish2work.onrender.com/api/student-courses', {
        course_id: courseId,
        student_id: studentId,
      });

      if (response.status === 200 || response.status === 201) {
        setAddedCourses(prevState => new Set(prevState).add(courseId));
        Alert.alert('Success', 'Course added successfully');
        fetchCourses(); // Refresh the available courses
      } else {
        Alert.alert('Error', 'Failed to add course');
      }
    } catch (error) {
      console.error('Error adding course:', error);
      Alert.alert('Error', 'Failed to add course');
    }
  };

  const renderCourseCard = (course) => {
    const isCourseAdded = addedCourses.has(course.course_id);

    return (
      <View style={styles.card} key={course.course_id}>
        <Text style={styles.courseName}>{course.name}</Text>
        <Text style={styles.courseDescription}>{course.description}</Text>
        <TouchableOpacity
          style={[styles.addButton, isCourseAdded && styles.addedButton]}
          onPress={() => isCourseAdded ? null : handleAddCourse(course.course_id)}
        >
          <Text style={styles.addButtonText}>
            {isCourseAdded ? <Ionicons name="checkmark" size={16} color="#fff" /> : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
              <Ionicons
                name="arrow-back"
                size={30}
                color="#4A90E2"
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              />
              <Text style={styles.title}> Add Courses</Text>
            </View>
      {availableCourses.length > 0 ? (
        availableCourses.map(course => (
          !addedCourses.has(course.course_id) ? renderCourseCard(course) : null
        ))
      ) : (
        <Text style={styles.noCoursesText}>No courses available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#2C2F6B',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    margin: 20
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  addedButton: {
    backgroundColor: '#2C2F6B',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noCoursesText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
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
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#2C2F6B',
      textAlign: 'center',
      flex: 1,
    },
});

export default AddCourse;
