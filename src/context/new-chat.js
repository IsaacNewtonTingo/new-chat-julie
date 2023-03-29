import {createContext} from 'react';

export const NewChatContext = createContext({
  newChat: false,
  setNewChat: () => {},
});
