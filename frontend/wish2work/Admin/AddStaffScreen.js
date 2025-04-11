import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddStaffScreen = () => {
  const navigation = useNavigation();
  const [staffId, setStaffId] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleNext = () => {
    if (!staffId || !email || !firstName || !lastName) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (staffId.length !== 8) {
      Alert.alert('Error', 'Staff ID must be exactly 8 characters');
      return;
    }
    if (!email.endsWith('@udst.edu.qa')) {
      Alert.alert('Error', 'Email must be a valid university email (@udst.edu.qa)');
      return;
    }
    navigation.navigate('AddStaff2Screen', { staffId, email, firstName, lastName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Staff</Text>

      <TextInput
        style={styles.input}
        placeholder="Staff ID"
        keyboardType="numeric"
        value={staffId}
        onChangeText={setStaffId}
      />
      <TextInput
        style={styles.input}
        placeholder="University Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleNext}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#130160',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default AddStaffScreen;
