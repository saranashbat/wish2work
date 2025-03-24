import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Categories from './components/Categories';


const Stack = createNativeStackNavigator();

const SearchStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Categories" component={Categories} />
      


    </Stack.Navigator>
  );
};

export default SearchStack;
