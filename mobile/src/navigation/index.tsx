import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';
import { COLORS } from '../constants/colors';

export default function Routes() {
  const { user, loading } = useAuth();
  const { theme } = useThemeContext();

  return (
    <NavigationContainer theme={theme}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : user ? (
        <AppRoutes />
      ) : (
        <AuthRoutes />
      )}
    </NavigationContainer>
  );
}
