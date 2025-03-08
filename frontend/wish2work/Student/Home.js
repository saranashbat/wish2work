import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Animated, Modal, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const motivationalPhrases = [
  "Your next opportunity is one step away! 🚀",
  "Build your future while you study! 📚",
  "Skills + Opportunity = Success! 💡",
  "Get noticed. Get hired. 💼",
];

const Home = () => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [messageIndex, setMessageIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false); // State for controlling modal visibility

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 1000, delay: 2000, useNativeDriver: true }),
      ]).start(() => {
        setMessageIndex((prevIndex) => (prevIndex + 1) % motivationalPhrases.length);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header with Logo and Icons */}
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <View style={styles.headerIcons}>
          {/* TouchableOpacity to open the modal */}
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <FontAwesome5 name="question-circle" size={24} color="#130160" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Animated Motivational Message */}
      <Animated.Text style={[styles.motivationalText, { opacity: fadeAnim }]}>
        {motivationalPhrases[messageIndex]}
      </Animated.Text>

      {/* Welcome Image */}
      <Image source={require('../assets/welcome3.png')} style={styles.image} />

      <Text style={styles.title}>Welcome to Wish2Work!</Text>
      <Text style={styles.subtitle}>Connecting students with on-campus job opportunities efficiently.</Text>

      {/* Features Sections with Icons */}
      <View style={styles.section}>
        <FontAwesome5 name="users" size={28} color="#130160" />
        <Text style={styles.sectionTitle}>What is Wish2Work?</Text>
        <Text style={styles.sectionText}>
          Wish2Work is a platform designed to connect students with faculty and staff to fill urgent, short-term vacancies efficiently.
        </Text>
      </View>

      <View style={styles.section}>
        <FontAwesome5 name="bullseye" size={28} color="#130160" />
        <Text style={styles.sectionTitle}>Our Objective</Text>
        <Text style={styles.sectionText}>
          Our goal is to simplify job matching by allowing university departments to search for students based on skills and qualifications, reducing the time and effort needed to fill roles.
        </Text>
      </View>

      <View style={styles.section}>
        <FontAwesome5 name="history" size={28} color="#130160" />
        <Text style={styles.sectionTitle}>How We Got Here</Text>
        <Text style={styles.sectionText}>
          Initially, we aimed to connect students with external companies, but we refined our focus to help students find urgent, short-term vacancies within UDST quickly and efficiently.
        </Text>
      </View>

      {/* Modal for showing app info and related questions */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Close the modal when requested
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>App Information</Text>
            <Text style={styles.modalText}>Wish2Work is a platform designed to connect students with faculty and staff to fill urgent, short-term vacancies efficiently.</Text>
            <Text style={styles.modalSubTitle}>Related Questions</Text>
            <Text style={styles.modalText}>- How to be selected for a job?</Text>
            <Text style={styles.modalText}>Answer: The selection done based on your skills and qualifications as well as your experience.</Text>

            <Text style={styles.modalText}>- How can I update my profile?</Text>
            <Text style={styles.modalText}>Answer: Go to your profile page and select the "Edit" option to update your information.</Text>

            <Text style={styles.modalSubTitle}>Meet the Developers</Text>
            <Text style={styles.modalText}>Developed by the awesome team at Wish2Work!</Text>

            {/* Close Button */}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#F2F7FA',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
  },
  motivationalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#130160',
    textAlign: 'center',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#130160',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#7A9FD9',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#130160',
    marginTop: 5,
  },
  sectionText: {
    fontSize: 16,
    color: '#4A4A4A',
    textAlign: 'center',
    marginTop: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#130160',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#4A4A4A',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#130160',
    marginTop: 20,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#130160',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Home;
