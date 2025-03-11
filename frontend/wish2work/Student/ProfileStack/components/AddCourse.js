import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

const AddCoursePage = () => {
  const route = useRoute();
  const { studentId } = route.params; // Extract studentId from route params
  const [availableCourses, setAvailableCourses] = useState([]);
  const [addedCourses, setAddedCourses] = useState(new Set());
  const [studentCourses, setStudentCourses] = useState([]); // Store all student courses

  // Fetch all available courses and the student's current courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch all available courses
        const availableCoursesResponse = await axios.get('https://wish2work.onrender.com/api/courses');
        setAvailableCourses(availableCoursesResponse.data); // Store all available courses

        // Fetch all student courses and filter by studentId
        const studentCoursesResponse = await axios.get('https://wish2work.onrender.com/api/student-courses');
        const studentCoursesForCurrentStudent = studentCoursesResponse.data.filter(course => course.student_id === studentId);
        setStudentCourses(studentCoursesForCurrentStudent); // Store the courses for the current student

        // Extract course IDs the student is already enrolled in
        const existingCourseIds = studentCoursesForCurrentStudent.map(course => course.course_id);
        setAddedCourses(new Set(existingCourseIds)); // Update addedCourses with the student's existing courses
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [studentId]);

  const handleAddCourse = async (courseId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/student-courses', {
        course_id: courseId,
        student_id: studentId,
      });

      if (response.status === 200) {
        setAddedCourses(prevState => new Set(prevState).add(courseId)); // Add the course to the "added" set
        Alert.alert('Success', 'Course added successfully');
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
      {availableCourses.length > 0 ? (
        availableCourses.map(course => {
          // Only render the course if it's not already added to the student's courses
          if (!addedCourses.has(course.course_id)) {
            return renderCourseCard(course);
          }
          return null; // Skip rendering if the course is already added
        })
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
    padding: 16,
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
    backgroundColor: '#2C2F6B', // Change color to indicate added state
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
});

export default AddCoursePage;
