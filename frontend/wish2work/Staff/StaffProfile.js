import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, Modal } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const StaffProfile = ({ navigation }) => {
  const [staff, setStaff] = useState(null);
  const [departmentName, setDepartmentName] = useState('');
  const [showInfoModal, setShowInfoModal] = useState(false);

  const auth = getAuth();
  const email = auth.currentUser?.email;

  useEffect(() => {
    const fetchStaffData = async () => {
      if (!email) return;
      try {
        const res = await axios.get(`https://wish2work.onrender.com/api/staff/email/${email}`);
        const staffData = res.data;
        const staffIdFromEmail = staffData.email.split('@')[0];
        setStaff({ ...staffData, staff_id: staffIdFromEmail });
        
        // Fetch department name
        const deptRes = await axios.get(`https://wish2work.onrender.com/api/departments/${staffData.department_id}`);
        setDepartmentName(deptRes.data.name);
      } catch (err) {
        console.error('Error fetching staff data:', err);
      }
    };

    fetchStaffData();
  }, [email]);

  if (!staff) {
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 5,
      }}>
        <Image
          source={require('../assets/logo.png')}
          style={{
            marginRight: 20,
            alignSelf: 'flex-end',
            width: width * 0.4,
            height: height * 0.08,
            resizeMode: 'contain',
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
          {staff.first_name} {staff.last_name}
        </Text>
        <Text style={{
          marginBottom: 10,
          marginLeft: width * 0.08,
          alignSelf: 'flex-start',
          color: 'white',
          fontSize: width * 0.045,
        }}>
          {staff.staff_id}
        </Text>
        <Text style={{
          marginBottom: 10,
          marginLeft: width * 0.08,
          alignSelf: 'flex-start',
          color: 'white',
          fontSize: width * 0.045,
        }}>
          {departmentName}
        </Text>
        <TouchableOpacity
          style={{
            marginTop: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            paddingHorizontal: 20,
            paddingVertical: 5,
            borderRadius: 5,
          }}
          onPress={() => navigation.navigate('Settings', { staffId: staff.staff_id, phone: staff.phone_number })}
        >
          <Text style={{ color: 'white' }}>Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={{ padding: width * 0.05 }}>
        <InfoRow icon="🏢" text={departmentName} />
        <InfoRow icon="✉️" text={staff.email} />
        <InfoRow icon="📞" text={staff.phone_number || 'N/A'} />

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={22} color="white" style={{ marginRight: 10 }} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
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
  logoutButton: {
    backgroundColor: '#D32F2F',
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
};

export default StaffProfile;
