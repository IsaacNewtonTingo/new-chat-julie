import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ChatThemeContext} from '../context/chat-theme-context';

import Discover from '../screens/dashboard/discover';
import QuickRequests from '../screens/dashboard/quick-requests';
import PrimaryText from '../components/texts/primary-text';
import colors from '../assets/colors/colors';
import {TouchableOpacity} from 'react-native';
import Conversation from '../screens/dashboard/conversation';

const Stack = createNativeStackNavigator();

export default function DiscoverNav() {
  const {chatTheme, setChatTheme} = useContext(ChatThemeContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerTintColor: colors.white,
      }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        component={Discover}
        name="Discover"
      />

      <Stack.Screen
        options={{
          headerShown: false,
        }}
        component={QuickRequests}
        name="QuickRequests"
      />
    </Stack.Navigator>
  );
}
