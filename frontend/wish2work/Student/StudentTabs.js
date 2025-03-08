import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import ProfileStack from './ProfileStack/ProfileStack';
import Home from './Home';

// Placeholder screens for the tabs (to be replaced with actual components)
const PlaceholderScreen = ({ name }) => (
  <View style={styles.placeholderScreen}>
    <Text style={{fontSize: 60}}>{name} Tab</Text>
  </View>
);

const Tab = createBottomTabNavigator();

const StudentTabNav = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#7A9FD9',
          tabBarInactiveTintColor: '#130160',
          tabBarStyle: {
            backgroundColor: '#F2F7FA',
            height: 75, // Fixed tab height
            marginBottom: 10,
            marginLeft: 10,
            marginRight: 10,
            paddingTop: 10,
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.5,
            elevation: 5,
          },
          tabBarLabelStyle: {
            paddingTop: 5,
            fontSize: 12, // Hide text labels

          },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={35} />
            ),
          }}
        />
        <Tab.Screen
          name="Email"
          component={() => <PlaceholderScreen name="Email" />}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="email" color={color} size={35} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account" color={color} size={35} />
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

export default StudentTabNav;
