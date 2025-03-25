import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native"; // to access route params and navigate

const Rating = () => {
  const route = useRoute();
  const navigation = useNavigation(); // To navigate back to the previous page
  const { student_id, staff_id, student_name, request_id } = route.params; // Get student_id and staff_id from the route params

  // Ensure student_id and staff_id are integers
  const studentId = parseInt(student_id, 10);
  const staffId = parseInt(staff_id, 10);

  const [rating, setRating] = useState(0); // Rating value (1-5)
  const [feedback, setFeedback] = useState(""); // Feedback text

  // Handle rating change (1-5 stars)
  const handleRating = (value) => {
    setRating(value);
  };

  // Handle submit rating
  const handleSubmit = async () => {
    console.log("Student ID:", studentId);
    console.log("Staff ID:", staffId);
    console.log("Rating Value:", rating);
    console.log("Feedback:", feedback);
  
    if (rating === 0) {
      Alert.alert("Error", "Please provide a rating between 1 and 5 stars.");
      return;
    }
  
    try {
      // Submit rating and feedback
      const ratingResponse = await axios.post("https://wish2work.onrender.com/api/student-rating", {
        student_id: studentId,
        staff_id: staffId,
        rating_value: rating,
        feedback: feedback
      });
  
      if (ratingResponse.status === 201) {
        Alert.alert("Success", "Rating and feedback submitted successfully.");
        
        // Update the request rating with the new rating
        const requestUpdateResponse = await axios.put(
          `https://wish2work.onrender.com/api/requests/${request_id}`, 
          { rating: rating } // Assuming `rating` is the field to update
        );
  
        if (requestUpdateResponse.status === 200) {
          // Pass the status as success to the previous page
          navigation.goBack();
        } else {
          Alert.alert("Error", "Failed to update the request rating.");
          // Pass the status as fail to the previous page
          navigation.goBack();
        }
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
        // Pass the status as fail to the previous page
        navigation.goBack();
        navigation.setParams({ rating_status: "fail" });
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to submit rating. Please try again.");
      
      // Pass the status as fail to the previous page
      navigation.goBack();
      navigation.setParams({ rating_status: "fail" });
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>{student_name}</Text>

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: "#fff",
  },
  container: {
    alignItems: "center", // Center the content horizontally
    justifyContent: "center", // Center the content vertically
    flex: 1, // Take up full height
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
    width: '100%', // Ensure it fits within the container
  },
  submitButton: {
    backgroundColor: "#2C2F6B", // Green color
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: '100%', // Make button full width
  },
  submitText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Rating;
