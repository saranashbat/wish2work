import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { format, parseISO } from "date-fns";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { getAuth } from "firebase/auth";

export default function Request({ route, navigation }) {
  const { studentId, first_name, last_name } = route.params;
  const [weekDates, setWeekDates] = useState([]);
  const [availability, setAvailability] = useState({});
  const [staffId, setStaffId] = useState("");

  useEffect(() => {
    const today = new Date();
    setWeekDates(
      Array.from({ length: 7 }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + i))
    );
    fetchAvailability();
    getStaffId();
  }, [studentId]);

  // Updated getStaffId function to fetch staff_id via email
  const getStaffId = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const email = user.email;
        const response = await axios.get(`https://wish2work.onrender.com/api/staff/email/${email}`);
        if (response.data && response.data.staff_id) {
          setStaffId(response.data.staff_id);
        }
      }
    } catch (error) {
      console.error("Error fetching staff ID:", error);
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await axios.get(`https://wish2work.onrender.com/api/students/${studentId}/availability`);
      if (!Array.isArray(response.data)) return;

      const structuredData = {};
      response.data.forEach(({ availability_id, availability_date, start_time, end_time }) => {
        if (!availability_date || !start_time || !end_time) return;
        const dateKey = format(parseISO(availability_date), "yyyy-MM-dd");
        structuredData[dateKey] = structuredData[dateKey] || [];
        structuredData[dateKey].push({
          id: availability_id,
          range: `${format(parseISO(start_time), "hh:mm a")} - ${format(parseISO(end_time), "hh:mm a")}`,
          startISO: start_time,
          endISO: end_time
        });
      });
      setAvailability(structuredData);
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  const handleSelectAvailability = (slot) => {
    navigation.navigate("Request2", {
      studentId,
      staffId: staffId, // Passing staff_id
      selectedTimeRange: {
        startTime: slot.startISO,
        endTime: slot.endISO,
        formatted: slot.range
      },
      first_name,
      last_name
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={30}
          color="#4A90E2"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text style={styles.title}>Request Availability</Text>
      </View>
      <ScrollView style={{ padding: 30 }}>
        <Text style={styles.titleText}>Select available timing for:</Text>
        <Text style={styles.titleText}>{first_name} {last_name}</Text>
        {weekDates.map((date) => {
          const dateKey = format(date, "yyyy-MM-dd");
          const slots = availability[dateKey] || [];
          if (slots.length === 0) return null;

          return (
            <View key={dateKey} style={styles.card}>
              <Text style={styles.cardTitle}>{format(date, "EEEE, MMM dd")}</Text>
              {slots.map((slot) => (
                <TouchableOpacity 
                  key={slot.id} 
                  style={styles.slotContainer}
                  onPress={() => handleSelectAvailability(slot)}
                >
                  <View style={styles.slotTimeContainer}>
                    <Text style={styles.slotTimeText}>{slot.range}</Text>
                  </View>
                  <View style={styles.selectButton}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>Select</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

// Keep the same styles from previous example

const styles = StyleSheet.create({
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
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  slotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  slotTimeContainer: {
    padding: 10,
    backgroundColor: '#F0F8FF',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#e2edfc',
    flex: 1,
  },
  slotTimeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectButton: {
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#2C2F6B',
    textAlign: 'center',
    borderRadius: 5,
    fontWeight: 'bold',
    fontSize: 12,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
