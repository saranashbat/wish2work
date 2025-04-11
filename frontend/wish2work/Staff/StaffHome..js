import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Animated, Modal, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const motivationalPhrases = [
  "Find the right student for the job! 🎯",
  "Quickly fill urgent vacancies! ⏳",
  "Connect with top student talent! 💡",
  "Streamline your hiring process! 🚀",
  "Your next great hire is a search away! 🔍"
];

const StaffHome = () => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [messageIndex, setMessageIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <FontAwesome5 name="question-circle" size={28} color="#1E3050" style={styles.icon} />
        </TouchableOpacity>
      </View>

      <Animated.Text style={[styles.motivationalText, { opacity: fadeAnim }]}>
        {motivationalPhrases[messageIndex]}
      </Animated.Text>

      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <Text style={styles.title}>Welcome to Wish2Work!</Text>
      <Text style={styles.subtitle}>Effortlessly match with qualified students for urgent vacancies.</Text>

      {/** Information Sections */}  
      {infoSections.map((section, index) => (
        <View key={index} style={styles.section}>
          <FontAwesome5 name={section.icon} size={30} color="#1E3050" />
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionText}>{section.text}</Text>
        </View>
      ))}

      {/** Modal for FAQ */}  
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Platform Information</Text>
            <Text style={styles.modalText}>Wish2Work enables UDST faculty to quickly identify students for urgent academic support roles.</Text>
            
            <Text style={styles.modalSubTitle}>Frequently Asked Questions</Text>
            {faq.map((item, index) => (
              <View style={{alignItems: "center"}} key={index}>
                <Text style={styles.modalTextBold}>{item.question}</Text>
                <Text style={styles.modalText}>{item.answer}</Text>
              </View>
            ))}

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const infoSections = [
  {
    icon: "users",
    title: "What is Wish2Work?",
    text: "A platform that helps UDST faculty find students with the right skills for urgent roles."
  },
  {
    icon: "search",
    title: "How It Works",
    text: "Browse student profiles by skills and availability. Select the best match for your needs."
  },
  {
    icon: "clock",
    title: "Fast & Efficient",
    text: "Quickly fill urgent vacancies without the hassle of a lengthy hiring process."
  }
];

const faq = [
  { question: "How do I find students?", answer: "Use the search feature to filter profiles based on skills, qualifications, and availability." },
  { question: "What roles can I fill?", answer: "Teaching assistants, lab monitors, research assistants, administrative support, and more." }
];

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', backgroundColor: '#EEF2F7', padding: 20 },
  header: { flexDirection: 'row-reverse', width: '100%', marginBottom: 15 },
  icon: { padding: 10 },
  motivationalText: { fontSize: 18, fontWeight: '600', color: '#1E3050', textAlign: 'center', marginBottom: 15 },
  logo: { width: 180, height: 80, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1E3050', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#5A6F94', textAlign: 'center', marginBottom: 20 },
  section: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, width: '100%', alignItems: 'center', marginBottom: 15, elevation: 4 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E3050', marginTop: 5 },
  sectionText: { fontSize: 16, color: '#4A4A4A', textAlign: 'center', marginTop: 5 },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContainer: { width: 320, padding: 20, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E3050', marginBottom: 15 },
  modalText: { fontSize: 16, color: '#4A4A4A', textAlign: 'center', marginBottom: 10 },
  modalSubTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E3050', marginTop: 20 },
  modalTextBold: { fontSize: 16, fontWeight: 'bold', color: '#1E3050', marginTop: 10 },
  closeButton: { marginTop: 20, backgroundColor: '#1E3050', padding: 12, borderRadius: 8 },
  closeButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default StaffHome;
