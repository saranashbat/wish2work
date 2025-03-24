import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import axios from 'axios';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";

const Courses = ({route, navigation}) => {
  const { studentId } = route.params;
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`https://wish2work.onrender.com/api/students/${studentId}/courses`);
      
      if (response.status === 200 && Array.isArray(response.data)) {
        setCourses(response.data);  // Set courses if data is valid
      } else {
        setCourses([]);  // No courses found, but not an error
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If the server returns a 404, assume it's because no courses are found
        setCourses([]);
      } else {
        console.error('Error fetching courses:', error);
        Alert.alert('Error', 'Failed to fetch courses. Please try again later.');
      }
    }
  };
  
  

  useFocusEffect(
    useCallback(() => {
      fetchCourses();
    }, [studentId])
  );

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await axios.delete(`https://wish2work.onrender.com/api/student-courses/${courseId}/${studentId}`);
      if (response.status === 200) {
        Alert.alert('Success', 'Course deleted successfully');
        setCourses(courses.filter(course => course.course_id !== courseId)); // Remove course from state
      } else {
        Alert.alert('Error', 'Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      Alert.alert('Error', 'Failed to delete course');
    }
  };

  const renderCourseCard = (course) => {
    return (
      <View style={styles.card} key={course.course_id}>
        <Text style={styles.courseName}>{course.name}</Text>
        <Text style={styles.courseDescription}>{course.description}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteCourse(course.course_id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
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
        <Text style={styles.title}>Courses</Text>
      </View>
      <TouchableOpacity 
        onPress={() => navigation.navigate('AddCourse', { studentId: studentId, existingCourses: courses })} 
        style={styles.addCourseButton}
      >
        <Text style={styles.addCourseButtonText}>+ Add Course</Text>
      </TouchableOpacity>
      
      {courses.length > 0 ? (
        courses.map(renderCourseCard)
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
    padding: 0,
  },
  card: {
    backgroundColor: '#2C2F6B',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    margin: 20,
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
  deleteButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addCourseButton: {
    backgroundColor: '#2C2F6B',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    margin: 20
  },
  addCourseButtonText: {
    color: '#fff',
    fontSize: 16,
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

export default Courses;
