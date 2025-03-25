import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
import ViewReq from './components/ViewReq';

const RequestStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ViewReq" component={ViewReq} />
    </Stack.Navigator>
  );
};

export default RequestStack;
