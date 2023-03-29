import {createContext} from 'react';

const defaultMessage = 'How can I help you today?';
export const ChatDataContext = createContext({
  chatID: '',
  setChatID: () => {},

  chatName: '',
  setChatName: () => {},

  messages: [
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
  ],
  setMessages: () => {},

  messagesToSend: [{role: 'system', content: 'You are a helpful assistant.'}],
  setMessagesToSend: () => {},

  createdNewChat: false,
  setCreatedNewChat: () => {},
});
