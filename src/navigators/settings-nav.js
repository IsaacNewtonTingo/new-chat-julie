import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Discover from '../screens/dashboard/discover';
import Settings from '../screens/settings/settings';
import colors from '../assets/colors/colors';
import Profile from '../screens/settings/profile';

const Stack = createNativeStackNavigator();

export default function SettingsNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerTintColor: colors.white,
        headerStyle: {
          backgroundColor: colors.black,
        },
      }}>
      <Stack.Screen
        options={{
          headerTitle: 'Settings',
          headerShown: false,
        }}
        component={Settings}
        name="Settings"
      />

      <Stack.Screen
        options={{
          headerTitle: 'Profile',
          headerShown: false,
        }}
        component={Profile}
        name="Profile"
      />
    </Stack.Navigator>
  );
}
