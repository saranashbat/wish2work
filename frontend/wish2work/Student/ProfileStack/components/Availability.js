import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { format, parseISO } from "date-fns";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";

const TimePickerModal = ({ visible, onClose, onConfirm }) => {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(new Date().setHours(new Date().getHours() + 1)));

  const handleConfirm = () => {
    // Validate the time values
    if (!startTime || !endTime || isNaN(startTime.getTime()) || isNaN(endTime.getTime()) || startTime >= endTime) {
      Alert.alert("Error", "End time must be after start time and both times must be valid.");
      return;
    }
    onConfirm(startTime, endTime);
    onClose();
  };

  return visible ? (
    <View
      style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        elevation: 5,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>Select Start Time:</Text>
      <DateTimePicker
        mode="time"
        value={startTime}
        onChange={(_, time) => {
          if (time && !isNaN(time.getTime())) { // Ensure valid time
            setStartTime(time);
          }
        }}
      />

      <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 10 }}>Select End Time:</Text>
      <DateTimePicker
        mode="time"
        value={endTime}
        onChange={(_, time) => {
          if (time && !isNaN(time.getTime())) { // Ensure valid time
            setEndTime(time);
          }
        }}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
        <TouchableOpacity onPress={onClose} style={{ padding: 10 }}>
          <Text style={{ color: "red" }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleConfirm} style={{ padding: 10 }}>
          <Text style={{ color: "green" }}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  ) : null;
};

export default function Availability({ route, navigation }) {
  const { studentId } = route.params;
  const [weekDates, setWeekDates] = useState([]);
  const [availability, setAvailability] = useState({});
  const [showPicker, setShowPicker] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const today = new Date();
    setWeekDates(Array.from({ length: 7 }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)));
    fetchAvailability();
  }, [studentId]);

  const fetchAvailability = async () => {
    try {
      const response = await axios.get(
        `https://wish2work.onrender.com/api/students/${studentId}/availability`
      );

      if (!Array.isArray(response.data)) throw new Error("Invalid response format");

      const structuredData = {};

      response.data.forEach(({ availability_date, start_time, end_time }) => {
        if (!availability_date || !start_time || !end_time) return;

        const dateKey = format(parseISO(availability_date), "yyyy-MM-dd");
        const timeSlot = `${format(parseISO(start_time), "hh:mm a")} - ${format(parseISO(end_time), "hh:mm a")}`;

        if (!structuredData[dateKey]) structuredData[dateKey] = new Set();
        structuredData[dateKey].add(timeSlot);
      });

      Object.keys(structuredData).forEach((date) => {
        structuredData[date] = Array.from(structuredData[date]); // Convert Set to Array
      });

      setAvailability(structuredData);
    } catch (error) {
      console.error("Error fetching availability:", error);
      Alert.alert("Error", "Failed to load availability.");
    }
  };

  const addTimeSlot = (date, start, end) => {
    if (!start || !end || start >= end) {
      Alert.alert("Error", "Invalid time range.");
      return;
    }

    const dateKey = format(date, "yyyy-MM-dd");
    const timeSlot = `${format(start, "hh:mm a")} - ${format(end, "hh:mm a")}`;

    setAvailability((prev) => {
      const updatedSlots = new Set(prev[dateKey] || []);
      if (updatedSlots.has(timeSlot)) {
        Alert.alert("Error", "This time slot already exists.");
        return prev;
      }
      updatedSlots.add(timeSlot);

      return { ...prev, [dateKey]: Array.from(updatedSlots) };
    });
  };

  const removeTimeSlot = (date, slot) => {
    const dateKey = format(date, "yyyy-MM-dd");
    setAvailability((prev) => {
      const updatedSlots = new Set(prev[dateKey]);
      updatedSlots.delete(slot);

      return { ...prev, [dateKey]: Array.from(updatedSlots) };
    });
  };

  const saveAvailability = async () => {
    try {
      const formattedData = [];
      Object.keys(availability).forEach((date) => {
        availability[date].forEach((slot) => {
          const [start, end] = slot.split(" - ");
          formattedData.push({
            student_id: studentId,
            availability_date: date,
            start_time: `${date}T${start}:00Z`,
            end_time: `${date}T${end}:00Z`,
          });
        });
      });

      await axios.post("https://wish2work.onrender.com/api/availability", formattedData);
      Alert.alert("Success", "Availability saved successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving availability:", error);
      Alert.alert("Error", "Failed to save availability.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
        <Ionicons name="arrow-back" size={30} color="#4A90E2" onPress={() => navigation.goBack()} />
        <Ionicons name="checkmark" size={30} color="#4A90E2" onPress={saveAvailability} />
      </View>

      <ScrollView>
        {weekDates.map((date) => {
          const dateKey = format(date, "yyyy-MM-dd");
          const slots = availability[dateKey] || [];

          return (
            <View key={dateKey} style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>{format(date, "EEEE, MMM dd")}</Text>

              {slots.map((slot, index) => (
                <View key={index} style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
                  <Text>{slot}</Text>
                  <TouchableOpacity onPress={() => removeTimeSlot(date, slot)} style={{ marginLeft: 10 }}>
                    <Text style={{ color: "red" }}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                style={{
                  backgroundColor: "#007BFF",
                  padding: 8,
                  borderRadius: 5,
                  marginTop: 5,
                  alignSelf: "flex-start",
                }}
                onPress={() => {
                  setSelectedDate(date);
                  setModalVisible(true);
                }}
              >
                <Text style={{ color: "#fff" }}>+ Add Time Slot</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <TimePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={(start, end) => {
          addTimeSlot(selectedDate, start, end);
        }}
      />
    </View>
  );
}
