import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert, Platform, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const CourseSkill = ({ route, navigation }) => {
  const { studentId } = route.params; // studentId passed from the previous page
  const [courses, setCourses] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch courses and skills for the student
  useEffect(() => {
    const fetchCoursesAndSkills = async () => {
      try {
        setLoading(true);

        // Fetch courses
        const courseResponse = await axios.get(`https://wish2work.onrender.com/api/students/${studentId}/courses`);
        setCourses(courseResponse.data);

        // Fetch skills
        const skillResponse = await axios.get(`https://wish2work.onrender.com/api/students/${studentId}/skills`);
        setSkills(skillResponse.data);

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchCoursesAndSkills();
  }, [studentId]);

  // Render course cards
  const renderCourseCard = (course) => (
    <View style={styles.card} key={course.course_id}>
      <Text style={styles.cardTitle}>{course.name}</Text>
      <Text style={styles.cardDescription}>{course.description}</Text>
    </View>
  );

  // Render skill cards
  const renderSkillCard = (skill) => (
    <View style={styles.card} key={skill.skill_id}>
      <Text style={styles.cardTitle}>{skill.title}</Text>
      <Text style={styles.cardDescription}>{skill.description}</Text>
    </View>
  );

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
        <Text style={styles.title}>Courses and Skills</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      ) : (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Courses</Text>
            {courses.length > 0 ? (
              courses.map(renderCourseCard)
            ) : (
              <Text style={styles.noDataText}>No courses available</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {skills.length > 0 ? (
              skills.map(renderSkillCard)
            ) : (
              <Text style={styles.noDataText}>No skills available</Text>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Light background for the whole screen
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
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C2F6B',
    flex: 1,
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff', // White background for cards
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    // Adding a stronger shadow effect
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow offset
    shadowOpacity: 0.3, // Increased opacity for a stronger shadow
    shadowRadius: 8, // Larger blur radius
    elevation: 8, // Elevation for Android to create shadow
    marginHorizontal: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2F6B',
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CourseSkill;
