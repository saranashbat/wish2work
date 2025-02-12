import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';

// Importing stacks


const Tab = createBottomTabNavigator();

// Placeholder screens for the tabs, REMOVE
const PlaceholderScreen = ({ name }) => (
    <View>
      <Text>{name} Tab</Text>
    </View>
  );

const AdminTabNav = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#ff6d3b',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#dee8fc', height: 80, paddingBottom: 10, paddingTop: 10 },
        tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={() => <PlaceholderScreen name="Home" />}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" color={color} size={40} />,
        }}
      />
      <Tab.Screen
        name="Email"
        component={() => <PlaceholderScreen name="Email" />}
        options={{
          headerShown: false,
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ color }) => <MaterialIcons name="favorite" color={color} size={40} />,
        }}
      />
      
      <Tab.Screen
        name="Profile"
        component={() => <PlaceholderScreen name="Profile" />}
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <MaterialIcons name="person" color={color} size={40} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminTabNav;
