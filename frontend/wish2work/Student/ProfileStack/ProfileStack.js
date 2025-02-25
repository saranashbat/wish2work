import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentProfile from './components/StudentProfile';
import EditAbout from './components/EditAbout';
import Availability from './components/Availability';


const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentProfile" component={StudentProfile} />
      <Stack.Screen name="EditAbout" component={EditAbout} />
      <Stack.Screen name="Availability" component={Availability} />

      
    </Stack.Navigator>
  );
};

export default ProfileStack;
