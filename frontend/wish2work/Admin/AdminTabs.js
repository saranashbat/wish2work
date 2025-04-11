import React from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Correct import

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Import screens
import AdminPage from './AdminPage';
import StaffList from './StaffList';
import StudentList from './StudentList';
import AddStaffScreen from './AddStaffScreen';
import AddStaff2Screen from './AddStaff2Screen';
import AddStudentScreen from './AddStudentScreen';
import AddStudent2Screen from './AddStudent2Screen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Staff Stack
const StaffStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="StaffList" component={StaffList} />
    <Stack.Screen name="AddStaffScreen" component={AddStaffScreen} />
    <Stack.Screen name="AddStaff2Screen" component={AddStaff2Screen} />
  </Stack.Navigator>
);

// Student Stack
const StudentStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="StudentList" component={StudentList} />
    <Stack.Screen name="AddStudentScreen" component={AddStudentScreen} />
    <Stack.Screen name="AddStudent2Screen" component={AddStudent2Screen} />
  </Stack.Navigator>
);

const AdminTabNav = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#7A9FD9', // Active tab color
          tabBarInactiveTintColor: '#130160', // Inactive tab color
          tabBarStyle: {
            backgroundColor: '#F2F7FA', // Tab bar background color
            height: 75,
            marginBottom: 10,
            marginLeft: 10,
            marginRight: 10,
            paddingTop: 10,
            borderRadius: 10, // Rounded corners
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.5,
            elevation: 5,
          },
          tabBarLabelStyle: {
            paddingTop: 5,
            fontSize: 12, // Adjusted font size
          },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Admin"
          component={AdminPage}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="dashboard" color={color} size={35} />
            ),
          }}
        />
        <Tab.Screen
          name="Staff"
          component={StaffStack}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="group" color={color} size={35} />
            ),
          }}
        />
        <Tab.Screen
          name="Students"
          component={StudentStack}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="school" color={color} size={35} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholderScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdminTabNav;
