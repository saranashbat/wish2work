import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';

const StaffList = ({ navigation }) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch staff from API
  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch('https://wish2work.onrender.com/api/staff');
      const data = await response.json();

      console.log("Fetched staff data:", data); // Debugging API response

      if (Array.isArray(data)) {
        setStaff(data); // Only set if data is an array
      } else {
        console.error("Unexpected API response format:", data);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a staff member
  const deleteStaff = async (staffId) => {
    try {
      const response = await fetch(`https://wish2work.onrender.com/api/staff/${staffId}`, { 
        method: 'DELETE' 
      });

      if (response.ok) {
        setStaff((prevStaff) => prevStaff.filter(member => member.staff_id !== staffId));
      } else {
        Alert.alert('Error', 'Could not delete staff member.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error while deleting staff member.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Add New Staff Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddStaffScreen')}>
        <Text style={styles.buttonText}>+ Add New Staff</Text>
      </TouchableOpacity>

      {/* Loading Indicator */}
      {loading && <Text style={styles.debugText}>Loading staff...</Text>}

      {/* Display message if no staff found */}
      {!loading && staff.length === 0 ? (
        <Text style={styles.debugText}>No staff found. Check API response.</Text>
      ) : null}

      {/* Staff List */}
      <FlatList
        data={staff}
        keyExtractor={(item) => item.staff_id?.toString()} // Ensure correct key
        renderItem={({ item }) => (
          <View style={styles.staffCard}>
            <View style={styles.staffInfo}>
              <Text style={styles.staffName}>{item.first_name} {item.last_name}</Text>
              <Text style={styles.staffEmail}>{item.email}</Text>
              <Text style={styles.staffPhone}>📞 {item.phone_number}</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteStaff(item.staff_id)}>
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4' },
  addButton: { backgroundColor: '#130160', padding: 15, borderRadius: 8, marginBottom: 15, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  staffCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 15, 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 3, 
    marginBottom: 10 
  },
  staffInfo: { flex: 1 },
  staffName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  staffEmail: { fontSize: 14, color: '#666' },
  staffPhone: { fontSize: 14, color: '#666', marginTop: 4 },
  deleteButton: { backgroundColor: 'red', padding: 10, borderRadius: 5, alignItems: 'center' },
  debugText: { textAlign: 'center', marginTop: 20, color: 'red', fontSize: 16 }
});

export default StaffList;
