import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';

const AdminPage = ({ navigation }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user && user.email) {
          const email = user.email;
          const adminId = email.split('@')[0];

          const response = await fetch(`https://wish2work.onrender.com/api/admins/${adminId}`);
          const data = await response.json();
          setAdmin(data);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#130160" />
        <Text style={styles.loadingText}>Loading admin info...</Text>
      </View>
    );
  }

  if (!admin) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Failed to load admin data.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section with Logo */}
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
      </View>

      {/* Admin Profile Section */}
      <View style={styles.profileCard}>
        <Ionicons name="person-circle-outline" size={60} color="#130160" />
        <Text style={styles.adminName}>{admin.first_name} {admin.last_name}</Text>
        <Text style={styles.adminRole}>Administrator</Text>
      </View>

      {/* Contact Info Section */}
      <View style={styles.infoContainer}>
        {/* Phone Row */}
        <View style={styles.infoCard}>
          <Ionicons name="call-outline" size={24} color="#130160" style={styles.icon} />
          <Text style={styles.infoText}>{admin.phone_number || 'N/A'}</Text>
        </View>
        {/* Email Row */}
        <View style={styles.infoCard}>
          <Ionicons name="mail-outline" size={24} color="#130160" style={styles.icon} />
          <Text style={styles.infoText}>{admin.email}</Text>
        </View>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Staff')}>
          <Ionicons name="people-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Manage Staff</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Students')}>
          <Ionicons name="school-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Manage Students</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    padding: 20, 
    backgroundColor: '#F4F4F9',
    justifyContent: 'flex-start' 
  },

  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#F4F4F9' 
  },

  loadingText: { 
    marginTop: 10, 
    fontSize: 16, 
    color: '#130160' 
  },

  errorText: { 
    fontSize: 16, 
    color: 'red' 
  },

  header: {
    backgroundColor: '#130160',
    paddingVertical: 20,
    marginBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3
  },

  logo: {
    width: 120,
    height: 40, 
    marginBottom: 10
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 1,
  },

  profileCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    alignItems: 'center',
    width: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },

  adminName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#130160',
    marginTop: 10
  },

  adminRole: {
    fontSize: 16,
    color: 'gray',
    marginTop: 4
  },

  infoContainer: {
    width: '100%',
    marginBottom: 30
  },

  infoCard: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'flex-start', // Align to start for better icon-text layout
    flexDirection: 'row', // Make it a row to place icon to the left
    alignItems: 'center', // Center vertically
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 }
  },

  icon: {
    marginRight: 10 // Add spacing between icon and text
  },

  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#130160',
    flex: 1, // Allow text to take remaining space
  },

  navContainer: {
    width: '100%',
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#130160',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: 'center',
    width: '100%'
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D32F2F', // Red color for logout button
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    justifyContent: 'center',
    width: '100%'
  },
});

export default AdminPage;
