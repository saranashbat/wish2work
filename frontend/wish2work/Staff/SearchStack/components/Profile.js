import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions, 
  Modal 
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const StudentProfile = ({ route, navigation }) => {
  const { 
    student_id,
    first_name,
    last_name,
    email,
    phone_number,
    average_rating,
    personal_description,
    program_id,
    programName,
    departmentName
  } = route.params;

  const [showInfoModal, setShowInfoModal] = React.useState(false);

  const formatRating = (rating) => {
    const rounded = Math.round(rating * 10) / 10;
    return `${rounded.toFixed(1)}/5.0`;
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f4f4f4' }}>
      <View style={styles.headerContainer}>
        <Image 
          source={require('../../../assets/logo.png')} 
          style={styles.logo} 
        />
        <Text style={styles.nameText}>
          {first_name} {last_name}
        </Text>
        <Text style={styles.idText}>{student_id}</Text>
        <Text style={styles.departmentText}>{departmentName}</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>🎓</Text>
          <Text style={styles.infoText}>{programName}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>✉️</Text>
          <Text style={styles.infoText}>{email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📞</Text>
          <Text style={styles.infoText}>{phone_number || 'N/A'}</Text>
        </View>

        <View style={styles.ratingContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>⭐</Text>
            <Text style={styles.infoText}>
              {average_rating ? formatRating(average_rating) : 'No rating yet'}
            </Text>
          </View>
          <TouchableOpacity style={{marginLeft: 5}} onPress={() => setShowInfoModal(true)}>
            <FontAwesome name="info-circle" size={22} color="#2C2F6B" />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Description</Text>
        </View>
        
        <ScrollView style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>
            {personal_description || 'No description provided'}
          </Text>
        </ScrollView>

        <View style={styles.buttonRow}>
        <TouchableOpacity 
            style={[styles.button, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
            onPress={() => navigation.navigate("CourseSkill", {studentId: student_id})}
        >
            <FontAwesome name="book" size={18} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Courses & Skills</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={[styles.button, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
            onPress={() => navigation.navigate("Availabilities", {studentId: student_id})}
        >
            <FontAwesome name="calendar" size={18} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Availability</Text>
        </TouchableOpacity>
        </View>

        <TouchableOpacity 
        style={[styles.button, { backgroundColor: "#4CAF50", flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
        onPress={()=>navigation.navigate("Request", {studentId: student_id, first_name: first_name, last_name: last_name})}
        >
        <FontAwesome name="paper-plane" size={18} color="white" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Send Request to Student</Text>
        </TouchableOpacity>

      </View>

      <Modal
        visible={showInfoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rating Information</Text>
            <Text style={styles.modalText}>
              This rating is based on feedback from previous employers and reflects 
              the student's overall performance and reliability.
            </Text>
            <TouchableOpacity 
              onPress={() => setShowInfoModal(false)} 
              style={styles.closeButton}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = {
  headerContainer: {
    backgroundColor: '#2C2F6B',
    paddingVertical: height * 0.03,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    width: width * 0.4,
    height: height * 0.08,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
    marginRight: width * 0.05,
  },
  nameText: {
    color: 'white',
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginLeft: width * 0.08,
    marginVertical: height * 0.01,
  },
  idText: {
    color: 'white',
    fontSize: width * 0.045,
    marginLeft: width * 0.08,
    marginBottom: height * 0.01,
  },
  departmentText: {
    color: 'white',
    fontSize: width * 0.045,
    marginLeft: width * 0.08,
    marginBottom: height * 0.02,
  },
  contentContainer: {
    padding: width * 0.05,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.005,
    marginLeft: width * 0.03,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: width * 0.03,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeader: {
    marginTop: height * 0.03,
    marginBottom: height * 0.01,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2F6B',
  },
  descriptionBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#7A9FD9',
    minHeight: height * 0.1,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: height * 0.01,
  },
  button: {
    flex: 1,
    backgroundColor: '#2C2F6B',
    padding: 17,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
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
    width: width * 0.85,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2C2F6B',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
    color: '#555',
  },
  closeButton: {
    backgroundColor: '#2C2F6B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
};

export default StudentProfile;
