import React from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchStack from './SearchStack/SearchStack';

const Tab = createBottomTabNavigator();

// Placeholder screens for the tabs
const PlaceholderScreen = ({ name }) => (
  <View style={styles.placeholderScreen}>
    <Text>{name} Tab</Text>
  </View>
);

const StaffTabNav = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#7A9FD9',
          tabBarInactiveTintColor: '#130160',
          tabBarStyle: {
            backgroundColor: '#F2F7FA',
            height: 75,
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
            fontSize: 12,
          },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={() => <PlaceholderScreen name="Home" />}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={35} />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchStack}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="search" color={color} size={35} />
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
          component={() => <PlaceholderScreen name="Profile" />}
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

export default StaffTabNav;
