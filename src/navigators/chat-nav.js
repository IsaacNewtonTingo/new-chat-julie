import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ChatThemeContext} from '../context/chat-theme-context';

import Conversation from '../screens/dashboard/conversation';
import colors from '../assets/colors/colors';
import PrimaryText from '../components/texts/primary-text';

import {ChatDataContext} from '../context/chat-data';

const Stack = createNativeStackNavigator();

export default function ChatNav() {
  const {chatTheme, setChatTheme} = useContext(ChatThemeContext);
  const defaultMessage = 'How can I help you today?';

  const {
    setChatID,
    setChatName,
    setMessages,
    setMessagesToSend,
    setCreatedNewChat,
  } = useContext(ChatDataContext);

  function handleNewChat() {
    setChatID(''), setChatName('');
    setMessages([
      {
        messageID: '1',
        content: defaultMessage,
        image: null,
        createdAt: new Date(),
        user: {
          userID: '1',
          name: 'Chat julie',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
    setMessagesToSend({
      role: 'system',
      content: 'You are a helpful assistant.',
    });
    setCreatedNewChat(false);
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerTintColor: colors.white,
      }}>
      {/* <Stack.Screen
        options={({route}) => ({
          headerTitle: 'Chat Julie',
          headerStyle: {
            backgroundColor:
              chatTheme == colors.theme1
                ? colors.darkOrange
                : chatTheme == colors.theme2
                ? colors.darkBlue
                : colors.darkRed,
          },
        })}
        component={Chat}
        name="Chat"
      /> */}

      {/* <Stack.Screen
        options={({route}) => ({
          headerTitle: '',
          headerStyle: {
            backgroundColor: colors.black,
          },
        })}
        component={Chat}
        name="Chat"
      /> */}

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
          //   <TouchableOpacity onPress={handleNewChat}>
          //     <FontAwesome name="edit" color={colors.white} size={25} />
          //   </TouchableOpacity>
          // ),
        })}
        component={Conversation}
        name="Conversation"
      />
    </Stack.Navigator>
  );
}
