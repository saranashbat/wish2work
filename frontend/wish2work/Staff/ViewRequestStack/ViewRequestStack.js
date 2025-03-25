import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ViewRequest from './components/ViewRequest';
import Rating from './components/Rating';

const Stack = createNativeStackNavigator();

const ViewRequestStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ViewRequest" component={ViewRequest} />
      <Stack.Screen name="Rating" component={Rating} />
    </Stack.Navigator>
  );
};

export default ViewRequestStack;
