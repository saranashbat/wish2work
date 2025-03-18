import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentProfile from './components/StudentProfile';
import EditAbout from './components/EditAbout';
import Availability from './components/Availability';
import Courses from './components/Courses';
import AddCourse from './components/AddCourse';
import Skills from './components/Skills';





const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentProfile" component={StudentProfile} />
      <Stack.Screen name="EditAbout" component={EditAbout} />
      <Stack.Screen name="Availability" component={Availability} />
      <Stack.Screen name="Courses" component={Courses} />
      <Stack.Screen name="AddCourse" component={AddCourse} />
      <Stack.Screen name="Skills" component={Skills} />

    </Stack.Navigator>
  );
};

export default ProfileStack;
