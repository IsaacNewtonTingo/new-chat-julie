import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {ChatThemeContext} from '../context/chat-theme-context';

import TabNav from './tab-nav';
import colors from '../assets/colors/colors';
import Conversation from '../screens/dashboard/conversation';
import PrimaryText from '../components/texts/primary-text';
import {TouchableOpacity} from 'react-native';
import {CredentialsContext} from '../context/credentials-context';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  const {chatTheme, setChatTheme} = useContext(ChatThemeContext);
  return (
    <CredentialsContext.Consumer>
      {({}) => (
        <Stack.Navigator
          screenOptions={{
            headerTintColor: colors.white,
            headerTitleAlign: 'center',
          }}>
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            component={TabNav}
            name="TabNav"
          />

          <Stack.Screen
            options={({route}) => ({
              headerTitle: () => (
                <PrimaryText style={{fontSize: 20}}>
                  {route.params?.title ? route.params.title : 'Chat Julie'}
                </PrimaryText>
              ),

              headerStyle: {
                backgroundColor:
                  chatTheme == colors.theme1
                    ? colors.darkOrange
                    : chatTheme == colors.theme2
                    ? colors.darkBlue
                    : colors.darkRed,
              },
              // headerRight: () => (
              //   <TouchableOpacity>
              //     <PrimaryText
              //       style={{
              //         fontSize: 20,
              //         color:
              //           chatTheme == colors.theme1
              //             ? colors.theme2
              //             : chatTheme == colors.theme2
              //             ? colors.theme1
              //             : chatTheme == colors.theme3
              //             ? colors.theme2
              //             : '',
              //       }}>
              //       New
              //     </PrimaryText>
              //   </TouchableOpacity>
              // ),
            })}
            component={Conversation}
            name="Conversation"
          />
        </Stack.Navigator>
      )}
    </CredentialsContext.Consumer>
  );
}
