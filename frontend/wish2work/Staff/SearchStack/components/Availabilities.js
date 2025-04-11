import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Platform } from "react-native";
import { format, parseISO } from "date-fns";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from 'axios';


export default function Availabilities({ route, navigation }) {
  const { studentId, first_name, last_name } = route.params;
  const [weekDates, setWeekDates] = useState([]);
  const [availability, setAvailability] = useState({});

  useEffect(() => {
    const today = new Date();
    setWeekDates(Array.from({ length: 7 }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)));
    fetchAvailability();
  }, [studentId]);

  const fetchAvailability = async () => {
    try {
      const response = await axios.get(`https://wish2work.onrender.com/api/students/${studentId}/availability`);

      if (!Array.isArray(response.data)) {
        setAvailability({});
        return;
      }

      const structuredData = {};
      response.data.forEach(({ availability_id, availability_date, start_time, end_time }) => {
        if (!availability_date || !start_time || !end_time) return;
        const dateKey = format(parseISO(availability_date), "yyyy-MM-dd");
        const timeSlot = {
          id: availability_id,
          range: `${format(parseISO(start_time), "hh:mm a")} - ${format(parseISO(end_time), "hh:mm a")}`,
        };
        if (!structuredData[dateKey]) structuredData[dateKey] = [];
        structuredData[dateKey].push(timeSlot);
      });

      setAvailability(structuredData);
    } catch (error) {
      setAvailability({}); // Just in case

    }
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
        <Text style={styles.title}>Student's Availability</Text>
      </View>
      <ScrollView style={{ padding: 30 }}>
        {weekDates.map((date) => {
          const dateKey = format(date, "yyyy-MM-dd");
          const slots = availability[dateKey] || [];
          return (
            <View key={dateKey} style={styles.card}>
              <Text style={styles.cardTitle}>{format(date, "EEEE, MMM dd")}</Text>
              {slots.length > 0 ? (
                slots.map((slot) => (
                  <View key={slot.id} style={styles.slotContainer}>
                    <View style={styles.slotTimeContainer}>
                      <Text style={styles.slotTimeText}>{slot.range}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noAvailabilityText}>No availabilities</Text>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

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
    marginVertical: 5,
  },
  slotTimeContainer: {
    padding: 10,
    backgroundColor: '#F0F8FF', // Subtle light blue background
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#e2edfc',
  },
  slotTimeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Darker text for contrast
  },
  noAvailabilityText: {
    fontSize: 16,
    fontStyle: 'italic', // Italic style for the "No availabilities" text
    color: '#333', // Normal text color
    marginTop: 10,
  },
});
