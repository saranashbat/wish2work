import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, Platform } from "react-native";
import { format, parseISO } from "date-fns";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Availability({ route, navigation }) {
  const { studentId } = route.params;
  const [weekDates, setWeekDates] = useState([]);
  const [availability, setAvailability] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const today = new Date();
    setWeekDates(Array.from({ length: 7 }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)));
    fetchAvailability();
  }, [studentId]);

  const TimePickerModal = ({ visible, onClose, onConfirm }) => {
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date(new Date().setHours(new Date().getHours() + 1)));
  
    const handleConfirm = () => {
      if (!startTime || !endTime || isNaN(startTime.getTime()) || isNaN(endTime.getTime()) || startTime >= endTime) {
        Alert.alert("Error", "End time must be after start time and both times must be valid.");
        return;
      }
  
      console.log("Start time:", startTime);
      console.log("End time:", endTime);
  
      onConfirm(selectedDate, startTime, endTime);
      onClose();
    };
  
    return visible ? (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Start Time:</Text>
          <DateTimePicker mode="time" display="default" value={startTime} onChange={(_, time) => time && setStartTime(time)} />
  
          <Text style={[styles.modalTitle, { marginTop: 20 }]}>Select End Time:</Text>
          <DateTimePicker 
            mode="time" 
            display="default" 
            value={endTime} 
            onChange={(_, time) => {
              if (time instanceof Date && !isNaN(time.getTime())) {
                setEndTime(time);
              }
            }} 
          />
  
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={onClose} style={styles.modalButton}>
              <Text style={{ color: "red" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm} style={styles.modalButton}>
              <Text style={{ color: "green" }}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ) : null;
  };
  

  const fetchAvailability = async () => {
    try {
      const response = await axios.get(`https://wish2work.onrender.com/api/students/${studentId}/availability`);

      // If the response is empty or not an array, set availability to an empty object
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
      if (error.response && error.response.status === 404) {
        // If 404, assume no availabilities exist and set an empty object
        setAvailability({});
      } else {
        console.error("Error fetching availability:", error);
      }
    }
  };

  const addTimeSlot = async (date, start, end) => {
    console.log("Start:", start);
    console.log("End:", end);  // Log the end time here

    if (!(start instanceof Date) || isNaN(start.getTime())) {
      console.error("Invalid start time", start);
      Alert.alert("Error", "Invalid start time.");
      return;
    }

    if (!(end instanceof Date) || isNaN(end.getTime())) {
      console.error("Invalid end time", end);
      Alert.alert("Error", "Invalid end time.");
      return;
    }

    try {
      const dateKey = format(date, "yyyy-MM-dd");

      // Ensure the time is formatted correctly for datetimeoffset
      const startTime = format(start, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
      const endTime = format(end, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");

      console.log("Posting availability:", {
        student_id: studentId,
        availability_date: dateKey,
        start_time: startTime,
        end_time: endTime,
      });

      const response = await axios.post("https://wish2work.onrender.com/api/availability", {
        student_id: studentId,
        availability_date: dateKey,
        start_time: startTime, // Use correctly formatted datetime
        end_time: endTime,     // Use correctly formatted datetime
      });

      console.log("Availability added successfully");

      const newSlot = {
        id: response.data.availability_id,
        range: `${format(start, "hh:mm a")} - ${format(end, "hh:mm a")}`,
      };
      setAvailability((prev) => ({ ...prev, [dateKey]: [...(prev[dateKey] || []), newSlot] }));
    } catch (error) {
      console.error("Error adding availability:", error);
      Alert.alert("Error", "Failed to add availability.");
    }
  };

  const removeTimeSlot = async (date, slot) => {
    try {
      await axios.delete(`https://wish2work.onrender.com/api/availability/${slot.id}`);
      console.log("Availability deleted successfully")
      const dateKey = format(date, "yyyy-MM-dd");
      setAvailability((prev) => ({ ...prev, [dateKey]: prev[dateKey].filter((s) => s.id !== slot.id) }));
    } catch (error) {
      console.error("Error removing availability:", error);
      Alert.alert("Error", "Failed to remove availability.");
    }
  };

  return (
    <View style={{ flex: 1}}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={30}
          color="#4A90E2"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text style={styles.title}>Availability</Text>
      </View>
      <ScrollView style={{padding: 30}}>
        {weekDates.map((date) => {
          const dateKey = format(date, "yyyy-MM-dd");
          const slots = availability[dateKey] || [];
          return (
            <View key={dateKey} style={styles.card}>
              <Text style={styles.cardTitle}>{format(date, "EEEE, MMM dd")}</Text>
              {slots.map((slot) => (
                <View key={slot.id} style={styles.slotContainer}>
                  <Text style={styles.slotText}>{slot.range}</Text>
                  <TouchableOpacity onPress={() => removeTimeSlot(date, slot)} style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity onPress={() => { setSelectedDate(date); setModalVisible(true); }} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add Time Slot</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
      <TimePickerModal visible={modalVisible} onClose={() => setModalVisible(false)} onConfirm={addTimeSlot} />
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
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  slotText: {
    fontSize: 16,
  },
  removeButton: {
    marginLeft: 10,
  },
  removeButtonText: {
    color: 'red',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#2C2F6B',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#fff',
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%", // Adjust the width as per your needs
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
  },
  modalCancelText: {
    color: 'red',
  },
  modalConfirmText: {
    color: 'green',
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dimmed background
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999, // Make sure it's on top of other content
  },
});
