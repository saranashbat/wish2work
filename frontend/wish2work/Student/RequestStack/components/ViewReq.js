import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { getAuth } from "firebase/auth";
import axios from "axios";

const ViewReq = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const auth = getAuth();
        const email = auth.currentUser?.email;
        if (!email) return;

        // Get student_id by trimming email
        const student_id = email.split("@")[0];

        // Fetch all requests for this student
        const requestRes = await axios.get(`https://wish2work.onrender.com/api/students/${student_id}/requests`);
        const requestData = requestRes.data;

        // Fetch staff details for each request
        const detailedRequests = await Promise.all(
          requestData.map(async (request) => {
            const staffRes = await axios.get(`https://wish2work.onrender.com/api/staff/${request.staff_id}`);
            return {
              ...request,
              staff_name: `${staffRes.data.first_name} ${staffRes.data.last_name}`,
              staff_email: staffRes.data.email,
            };
          })
        );

        setRequests(detailedRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Function to format time without seconds
  const formatTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }); // HH:MM AM/PM format
  };

  // Function to handle updating request status
  const updateRequestStatus = async (request_id, status) => {
    try {
      await axios.put(`https://wish2work.onrender.com/api/requests/${request_id}`, { status });
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.request_id === request_id ? { ...request, status } : request
        )
      );
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: "#f4f4f4" }}>
      {/* Page Title */}
      <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 16 }}>
        Your Requests
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : requests.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20, fontSize: 16 }}>No requests found</Text>
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
              borderLeftColor: item.status === "Pending" ? "orange" : item.status === "Approved" ? "green" : "red",
            }}
          >
            {/* Staff Name & Email */}
            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 10 }}>From: {item.staff_name}</Text>
              <Text style={{ fontSize: 14, color: "#666", marginBottom: 10}}>{item.staff_email}</Text>
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
                  color: item.status === "Pending" ? "orange" : item.status === "Approved" ? "green" : "red",
                }}
              >
                {item.status}
              </Text>
            </View>

            {/* Action Buttons */}
            {item.status === "Pending" && (
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
                <Text
                  onPress={() => updateRequestStatus(item.request_id, "Approved")}
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    color: "green",
                    textDecorationLine: "underline",
                  }}
                >
                  Approve
                </Text>
                <Text
                  onPress={() => updateRequestStatus(item.request_id, "Disapproved")}
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    color: "red",
                    textDecorationLine: "underline",
                  }}
                >
                  Disapprove
                </Text>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default ViewReq;
