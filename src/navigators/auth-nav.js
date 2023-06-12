import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/auth/login';
import Welcome from '../screens/auth/welcome';
import Signup from '../screens/auth/signup';
import TabNav from './tab-nav';
import ForgotPassword from '../screens/auth/forgot-password';
import {CredentialsContext} from '../context/credentials-context';
import ConfirmEmail from '../screens/auth/confirm-email';
import colors from '../assets/colors/colors';
import ResetPassword from '../screens/auth/reset-password';
import ChooseSubscription from '../screens/subscription/choose-subscription';
import AuthSubscription from '../screens/subscription/auth-subscription';

const Stack = createNativeStackNavigator();

export default function AuthNav() {
  return (
    <CredentialsContext.Consumer>
      {({}) => (
        <Stack.Navigator
          initialRouteName=""
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.heading,
            },
            headerTintColor: colors.white,
            headerTitleAlign: 'center',
          }}>
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            component={Welcome}
            name="Welcome"
          />
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            component={Login}
            name="Login"
          />

          <Stack.Screen
            options={{
              headerShown: false,
            }}
            component={Signup}
            name="Signup"
          />

          <Stack.Screen
            options={{
              headerShown: false,
            }}
            component={AuthSubscription}
            name="AuthSubscription"
          />

          <Stack.Screen
            options={{
              headerTitle: 'Verify email',
              // headerShown: false,
            }}
            component={ConfirmEmail}
            name="ConfirmEmail"
          />

          <Stack.Screen
            options={{
              headerTitle: 'Reset password',
            }}
            component={ForgotPassword}
            name="ForgotPassword"
          />

          <Stack.Screen
            options={{
              headerTitle: 'Reset password',
            }}
            component={ResetPassword}
            name="ResetPassword"
          />
        </Stack.Navigator>
      )}
    </CredentialsContext.Consumer>
  );
}
