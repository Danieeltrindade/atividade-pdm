import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Screens } from './screenNames';
import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import NewTransactionScreen from '../screens/NewTransactionScreen';
import SummaryScreen from '../screens/SummaryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS } from '../constants/colors';

export type AppTabParamList = {
  [Screens.Home]: undefined;
  [Screens.Transactions]: undefined;
  [Screens.NewTransaction]: undefined;
  [Screens.Summary]: undefined;
  [Screens.Profile]: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

export default function AppRoutes() {
  return (
    <Tab.Navigator
      initialRouteName={Screens.Home}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          height: 64,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarIcon: ({ color, size }) => {
          let iconName: string = 'circle';

          switch (route.name) {
            case Screens.Home:
              iconName = 'home-outline';
              break;
            case Screens.Transactions:
              iconName = 'wallet-outline';
              break;
            case Screens.NewTransaction:
              iconName = 'plus-box-outline';
              break;
            case Screens.Summary:
              iconName = 'chart-pie';
              break;
            case Screens.Profile:
              iconName = 'account-circle-outline';
              break;
          }

          return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name={Screens.Home} component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name={Screens.Transactions} component={TransactionsScreen} options={{ title: 'Transações' }} />
      <Tab.Screen name={Screens.NewTransaction} component={NewTransactionScreen} options={{ title: 'Nova' }} />
      <Tab.Screen name={Screens.Summary} component={SummaryScreen} options={{ title: 'Resumo' }} />
      <Tab.Screen name={Screens.Profile} component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}
