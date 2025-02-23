import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // For iOS-like icons
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';  // Assuming axios for API calls

const EditAbout = ({ route }) => {
  const navigation = useNavigation();
  const [description, setDescription] = useState(route.params?.description || '');  // Allow empty description
  const studentId = route.params?.studentId;  // Assume student ID is passed in the params

  // API endpoint to update student description
  const updateDescription = async () => {
    try {
      const response = await axios.put(
        `https://wish2work.onrender.com/api/students/${studentId}`,
        { personal_description: description }  // Send the (possibly empty) description
      );

      if (response.status === 200) {
        console.log('Description updated successfully');

        // Pass updated description back to profile screen
        navigation.navigate('StudentProfile', {
          updatedDescription: description,
        });
      } else {
        console.error('Error updating description');
      }
    } catch (error) {
      console.error('Failed to update description:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with back and save button */}
      <View style={styles.header}>
        <Ionicons 
          name="arrow-back" 
          size={30} 
          color="#4A90E2" 
          onPress={() => navigation.goBack()} 
        />
        <Ionicons 
          name="checkmark" 
          size={30} 
          color="#4A90E2" 
          onPress={updateDescription} 
        />
      </View>

      {/* Description input */}
      <TextInput
        style={styles.textInput}
        multiline
        placeholder="Edit your description..."
        value={description}
        onChangeText={setDescription}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  textInput: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    fontSize: 16,
    color: '#333',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 30,
    margin: 30,
    textAlignVertical: 'top',
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});

export default EditAbout;
