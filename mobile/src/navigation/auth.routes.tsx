import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Screens } from './screenNames';
import LoginScreen from '../screens/LoginScreen';

export type AuthStackParamList = {
  [Screens.Login]: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Screens.Login} component={LoginScreen} />
    </Stack.Navigator>
  );
}
