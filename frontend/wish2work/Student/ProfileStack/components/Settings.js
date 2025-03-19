import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Dimensions, Platform } from 'react-native';
import { getAuth, updatePassword } from 'firebase/auth';
import axios from 'axios';
import Ionicons from "react-native-vector-icons/Ionicons";


const { width, height } = Dimensions.get('window');

const Settings = ({ route, navigation }) => {
  const { studentId, phone } = route.params;  // Get the studentId and oldPhoneNumber from route params
  const [phoneNumber, setPhoneNumber] = useState(phone || ''); // Set the initial phone number to oldPhoneNumber
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const auth = getAuth();

  const handleSaveChanges = async () => {
    setLoading(true);
    setError('');
  
    // Update phone number in the database
    try {
      await axios.put(`https://wish2work.onrender.com/api/students/${studentId}`, {
        phone_number: phoneNumber,
      });
  
      // Optionally, handle password update with Firebase Auth if needed
      if (newPassword) {
        const user = auth.currentUser;
        await updatePassword(user, newPassword);
      }
  
      Alert.alert('Success', 'Your settings have been updated.');
  
      // Reload the screen by replacing it with itself
      navigation.replace('Settings', { studentId, phone: phoneNumber });
  
      setLoading(false);
    } catch (err) {
      setError('Failed to update settings. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f4f4f4' }}>
        <View style={styles.header}>
                <Ionicons
                  name="arrow-back"
                  size={30}
                  color="#4A90E2"
                  onPress={() => navigation.goBack()}
                  style={styles.backButton}
                />
                <Text style={styles.title}>Settings</Text>
              </View>
      <View style={{ padding: width * 0.05 }}>

        {/* Display Old Phone Number */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Old Phone Number:</Text>
          <TextInput
            style={styles.input}
            value={phone.toString()}
            editable={false} // This field is not editable
          />
        </View>

        {/* Editable Phone Number Section */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Phone Number:</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholder="Enter new phone number"
          />
        </View>

        {/* Password Section */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password:</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholder="Enter new password"
          />
        </View>

        {/* Error Message */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Save Button */}
        <TouchableOpacity onPress={handleSaveChanges} style={styles.saveButton}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = {
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#2C2F6B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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

};

export default Settings;
