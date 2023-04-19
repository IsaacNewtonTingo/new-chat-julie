import {StyleSheet, LogBox} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';

import Decider from './src/navigators/decider';

import {CredentialsContext} from './src/context/credentials-context';
import {ChatThemeContext} from './src/context/chat-theme-context';
import {NewChatContext} from './src/context/new-chat';
import {ChatDataContext} from './src/context/chat-data';

import EncryptedStorage from 'react-native-encrypted-storage';
import TabNav from './src/navigators/tab-nav';
import HomeStack from './src/navigators/home-stack';

import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthNav from './src/navigators/auth-nav';
import ChooseSubscription from './src/screens/subscription/choose-subscription';

LogBox.ignoreAllLogs();

export default function App() {
  const defaultMessage = 'How can I help you today?';

  const [storedCredentials, setStoredCredentials] = useState(null);
  const [chatTheme, setChatTheme] = useState('');

  const [chatID, setChatID] = useState('');
  const [chatName, setChatName] = useState('');
  const [messages, setMessages] = useState([
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
  const [messagesToSend, setMessagesToSend] = useState([
    {role: 'system', content: 'You are a helpful assistant.'},
  ]);
  const [createdNewChat, setCreatedNewChat] = useState(false);

  useEffect(() => {
    checkStoredUserData();
    checkChatTheme();
  }, []);

  async function checkChatTheme() {
    const value = await AsyncStorage.getItem('chatTheme');
    if (value) {
      setChatTheme(value);
    } else {
      setChatTheme('');
    }
  }

  async function checkStoredUserData() {
    try {
      const userData = await EncryptedStorage.getItem('userData');
      if (userData !== null) {
        setStoredCredentials(JSON.parse(userData));
      } else {
        setStoredCredentials(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <CredentialsContext.Provider
      value={{storedCredentials, setStoredCredentials}}>
      <ChatDataContext.Provider
        value={{
          chatID,
          setChatID,

          chatName,
          setChatName,

          messages,
          setMessages,

          messagesToSend,
          setMessagesToSend,

          createdNewChat,
          setCreatedNewChat,
        }}>
        <ChatThemeContext.Provider value={{chatTheme, setChatTheme}}>
          <NativeBaseProvider>
            <NavigationContainer>
              <Decider />
            </NavigationContainer>
          </NativeBaseProvider>
        </ChatThemeContext.Provider>
      </ChatDataContext.Provider>
    </CredentialsContext.Provider>
  );
}

const styles = StyleSheet.create({});
