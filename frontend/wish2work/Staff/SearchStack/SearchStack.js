import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Categories from './components/Categories';
import Search from './components/Search';
import Profile from './components/Profile';


const Stack = createNativeStackNavigator();

const SearchStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Categories" component={Categories} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Profile" component={Profile} />


    </Stack.Navigator>
  );
};

export default SearchStack;
