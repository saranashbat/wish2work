import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { getAuth } from "firebase/auth";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native"; // Importing useFocusEffect

const ViewRequest = ({ navigation, route }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [staffId, setStaffId] = useState(null); // State for storing staff_id

  useFocusEffect(
    React.useCallback(() => {
      const fetchRequests = async () => {
        try {
          const auth = getAuth();
          const email = auth.currentUser?.email;
          if (!email) return;

          // Get staff_id using email
          const staffRes = await axios.get(`https://wish2work.onrender.com/api/staff/email/${email}`);
          const staff_id = staffRes.data.staff_id;
          setStaffId(staff_id); // Set staff_id in the state

          // Fetch all requests for this staff
          const requestRes = await axios.get(`https://wish2work.onrender.com/api/staff/${staff_id}/requests`);
          const requestData = requestRes.data;

          // Fetch student details and check if rating is provided for each request
          const detailedRequests = await Promise.all(
            requestData.map(async (request) => {
              const studentRes = await axios.get(`https://wish2work.onrender.com/api/students/${request.student_id}`);
              const requestDetail = await axios.get(`https://wish2work.onrender.com/api/requests/${request.request_id}`);
              return {
                ...request,
                student_name: `${studentRes.data.first_name} ${studentRes.data.last_name}`,
                student_email: studentRes.data.email,
                ratingGiven: requestDetail.data.rating, // Check if rating is provided
              };
            })
          );

          setRequests(detailedRequests.reverse());
        } catch (error) {
          console.error("Error fetching requests:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchRequests();
    }, [])
  );

  // Function to format time without seconds
  const formatTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }); // HH:MM AM/PM format
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: "#f4f4f4" }}>
      {/* Page Title */}
      <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", margin: 16 }}>Your Requests</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : requests.length === 0 ? (
        <View style={{ marginTop: 20, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 18, color: "#555", textAlign: "center", marginBottom: 10 }}>
            No requests yet
          </Text>
          <Text style={{ fontSize: 14, color: "#777", textAlign: "center", paddingHorizontal: 20 }}>
            It looks like you haven't made any requests yet.
          </Text>
        </View>
      ) : (
        requests.map((item) => (
          <View
            key={item.request_id}
            style={{
              backgroundColor: "white",
              padding: 16,
              marginVertical: 8,
              borderRadius: 12,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 3,
              borderLeftWidth: 5,
              borderLeftColor:
                item.status === "Pending"
                  ? "orange"
                  : item.status === "Approved"
                  ? "green"
                  : item.status === "Disapproved"
                  ? "red"
                  : "gray", // Handling Disapproved status with red
            }}
          >
            {/* Student Name & Email */}
            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 10 }}>To: {item.student_name}</Text>
              <Text style={{ fontSize: 14, color: "#666", marginBottom: 10 }}>{item.student_email}</Text>
            </View>

            {/* Request Title */}
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333" }}>
              {item.title}
            </Text>

            {/* Request Message (only display if exists) */}
            {item.message && (
              <Text style={{ fontSize: 14, color: "#555", marginTop: 8 }}>
                {item.message}
              </Text>
            )}

            {/* Request Details */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
              <View>
                <Text style={{ fontSize: 14, color: "#555" }}>Start</Text>
                <Text style={{ fontSize: 14, fontWeight: "600" }}>{formatTime(item.start_time)}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 14, color: "#555" }}>End</Text>
                <Text style={{ fontSize: 14, fontWeight: "600" }}>{formatTime(item.end_time)}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 14, color: "#555" }}>Date</Text>
                <Text style={{ fontSize: 14, fontWeight: "600" }}>{new Date(item.availability_date).toDateString()}</Text>
              </View>
            </View>

            {/* Status Badge */}
            <View style={{ marginTop: 12, alignSelf: "flex-end" }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color:
                    item.status === "Pending"
                      ? "orange"
                      : item.status === "Approved"
                      ? "green"
                      : item.status === "Disapproved"
                      ? "red"
                      : "black", // Handling Disapproved status with red
                }}
              >
                {item.status}
              </Text>
            </View>

            {/* "Rate Student for Job" Button (Only for Approved Requests and if no rating has been given) */}
            {item.status === "Approved" && staffId && !item.ratingGiven && (
              <TouchableOpacity
                style={{
                  marginTop: 12,
                  backgroundColor: "#f0f6ff", // Light grey background
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 24,
                  flexDirection: "row",
                  alignItems: "center",
                  alignSelf: "flex-start",
                }}
                onPress={() => navigation.navigate("Rating", { student_id: item.student_id, staff_id: staffId, student_name: item.student_name, request_id: item.request_id })}
              >
                <Text style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="star" size={18} color="#FFD700" style={{ marginRight: 8 }} /> {/* Yellow star */}
                  Rate Student for Job
                </Text>
              </TouchableOpacity>
            )}

            {/* "Rating Given" Text and Checkmark Icon (If Rating is already given) */}
            {item.ratingGiven && (
              <View
                style={{
                  marginTop: 12,
                  backgroundColor: "#e0f7fa", // Light blue background
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 24,
                  flexDirection: "row",
                  alignItems: "center",
                  alignSelf: "flex-start",
                }}
              >
                <Text style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="check" size={18} color="#4CAF50" style={{ marginRight: 8 }} /> {/* Green checkmark */}
                  Rating Given
                </Text>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default ViewRequest;
