import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { useRoute } from "@react-navigation/native"; // to access route params

const Rating = () => {
  const route = useRoute();
  const { student_id, staff_id } = route.params; // Get student_id and staff_id from the route params

  const [rating, setRating] = useState(0); // Rating value (1-5)
  const [feedback, setFeedback] = useState(""); // Feedback text

  // Handle rating change (1-5 stars)
  const handleRating = (value) => {
    setRating(value);
  };

  // Handle submit rating
  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Error", "Please provide a rating between 1 and 5 stars.");
      return;
    }

    try {
      const response = await axios.post("https://wish2work.onrender.com/api/student-rating", {
        student_id,
        employer_id: staff_id,
        rating_value: rating,
        feedback,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Rating and feedback submitted successfully.");
        // You can redirect or reset fields here if needed
        setRating(0); // Reset rating
        setFeedback(""); // Reset feedback
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to submit rating. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate Student</Text>

      {/* Rating (1-5 stars) */}
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((value) => (
          <TouchableOpacity key={value} onPress={() => handleRating(value)}>
            <Icon
              name="star"
              size={30}
              color={value <= rating ? "#FFD700" : "#ccc"} // Yellow for selected stars, grey for unselected
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Feedback Input */}
      <TextInput
        style={styles.textInput}
        placeholder="Enter your feedback"
        value={feedback}
        onChangeText={setFeedback}
        multiline
        numberOfLines={4}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Rating</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  star: {
    margin: 5,
  },
  textInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
    height: 120,
    textAlignVertical: "top",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#4CAF50", // Green color
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Rating;
