import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Categories from './components/Categories';
import Search from './components/Search';
import Profile from './components/Profile';
import CourseSkill from './components/CourseSkill';
import Availabilities from './components/Availabilities';


const Stack = createNativeStackNavigator();

const SearchStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Categories" component={Categories} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="CourseSkill" component={CourseSkill} />
      <Stack.Screen name="Availabilities" component={Availabilities} />

    </Stack.Navigator>
  );
};

export default SearchStack;
