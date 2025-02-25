import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, addDays, parseISO } from "date-fns";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function AvailabilityScreen({ route, navigation }) {
  const { studentId } = route.params;
  const [availability, setAvailability] = useState({});
  const [showPicker, setShowPicker] = useState(null);
  const [weekDates, setWeekDates] = useState([]);

  useEffect(() => {
    const today = new Date();
    const newWeek = Array.from({ length: 7 }, (_, i) => addDays(today, i));
    setWeekDates(newWeek);
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await axios.get(`https://wish2work.onrender.com/api/students/${studentId}/availability`);
      const data = response.data;
      
      console.log("API Response:", data); // Log the data to inspect the response format
      
      // Check if data is an array
      if (Array.isArray(data)) {
        const formattedData = {};
        data.forEach(({ availability_date }) => {
          const key = format(parseISO(availability_date), "yyyy-MM-dd");
          if (!formattedData[key]) formattedData[key] = [];
          formattedData[key].push({ start: new Date(availability_date) });
        });
  
        setAvailability(formattedData);
      } else {
        throw new Error("Expected an array but received something else.");
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      Alert.alert("Error", "Failed to load availability.");
    }
  };
  

  const addTimeSlot = (date, start, end) => {
    const key = format(date, "yyyy-MM-dd");
    setAvailability((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), { start, end }].sort((a, b) => a.start - b.start),
    }));
  };

  const removeTimeSlot = (date, index) => {
    const key = format(date, "yyyy-MM-dd");
    setAvailability((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  const saveAvailability = async () => {
    try {
      for (const date in availability) {
        for (const slot of availability[date]) {
          await axios.post("https://wish2work.onrender.com/api/availability", {
            studentId,
            date,
            start: slot.start.toISOString(),
            end: slot.end.toISOString(),
          });
        }
      }
      Alert.alert("Success", "Availability saved successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving availability:", error);
      Alert.alert("Error", "Failed to save availability.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Header with Back and Save Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
        <Ionicons name="arrow-back" size={30} color="#4A90E2" onPress={() => navigation.goBack()} />
        <Ionicons name="checkmark" size={30} color="#4A90E2" onPress={saveAvailability} />
      </View>

      {/* Availability List */}
      <ScrollView>
        {weekDates.map((date) => {
          const key = format(date, "yyyy-MM-dd");
          return (
            <View key={key} style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>{format(date, "EEEE, MMM dd")}</Text>
              {availability[key]?.map((slot, index) => (
                <View key={index} style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
                  <Text>{format(slot.start, "hh:mm a")} - {format(slot.end, "hh:mm a")}</Text>
                  <TouchableOpacity onPress={() => removeTimeSlot(date, index)} style={{ marginLeft: 10 }}>
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
                onPress={() => setShowPicker(date)}
              >
                <Text style={{ color: "#fff" }}>+ Add Time Slot</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* Time Picker Modal */}
      {showPicker && (
        <TimePickerModal
          visible={!!showPicker}
          onClose={() => setShowPicker(null)}
          onConfirm={(start, end) => {
            addTimeSlot(showPicker, start, end);
            setShowPicker(null);
          }}
        />
      )}
    </View>
  );
}

const TimePickerModal = ({ visible, onClose, onConfirm }) => {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

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
      <DateTimePicker mode="time" value={startTime} onChange={(_, time) => setStartTime(time || startTime)} />

      <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 10 }}>Select End Time:</Text>
      <DateTimePicker mode="time" value={endTime} onChange={(_, time) => setEndTime(time || endTime)} />

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
        <TouchableOpacity onPress={onClose} style={{ padding: 10 }}>
          <Text style={{ color: "red" }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onConfirm(startTime, endTime)} style={{ padding: 10 }}>
          <Text style={{ color: "green" }}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  ) : null;
};
