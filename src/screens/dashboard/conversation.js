import {
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
  Image,
  Animated,
} from 'react-native';

import React, {useState, useEffect, useRef, useContext} from 'react';

import Voice from '@react-native-community/voice';

import globalStyles from '../../assets/styles/global-styles';
import ChatInput from '../../components/inputs/chat-input';
import colors from '../../assets/colors/colors';

import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MessageItem from '../../components/cards/message-item';
import {showMyToast} from '../../functions/show-toast';
import {BarIndicator, PulseIndicator} from 'react-native-indicators';

import {ChatThemeContext} from '../../context/chat-theme-context';

import axios from 'axios';
import {Modal} from 'native-base';
import {ScrollView} from 'react-native';
import PrimaryButton from '../../components/buttons/primary-button';
import SecondaryButton from '../../components/buttons/secondary-button';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {CredentialsContext} from '../../context/credentials-context';
import RecordingModal from '../../components/modal/recording';

const {width, height} = Dimensions.get('window');

export default function Conversation({route, navigation}) {
  const {storedCredentials} = useContext(CredentialsContext);

  const textResponse =
    route.params?.title !== 'Image generation' ? true : false;

  const defaultMessage = textResponse
    ? 'How can I help you today?'
    : 'Describe an image you want me to generate for you';

  const {chatTheme, setChatTheme} = useContext(ChatThemeContext);

  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [awaitingMessage, setAwaitingMessage] = useState(false);

  const [messages, setMessages] = useState([
    {
      messageID: '1',
      content: defaultMessage,
      image: null,
      createdAt: new Date(),
      user: `${process.env.CHAT_JULIE_ID}`,
    },
  ]);

  const [messagesToSend, setMessagesToSend] = useState([
    {role: 'system', content: 'You are a helpful assistant.'},
  ]);

  const [userID, setUserID] = useState('');
  const [token, setToken] = useState('');

  const [chatID, setChatID] = useState('');
  const [chatName, setChatName] = useState('');
  const [createdNewChat, setCreatedNewChat] = useState(false);

  // const {
  //   chatID,
  //   setChatID,

  //   chatName,
  //   setChatName,

  //   messages,
  //   setMessages,

  //   messagesToSend,
  //   setMessagesToSend,

  //   createdNewChat,
  //   setCreatedNewChat,
  // } = useContext(ChatDataContext);

  const [message, setMessage] = useState('');
  const [isRecording, setRecording] = useState(false);

  const [themesModal, setThemesModal] = useState(false);
  const scrollViewRef = useRef(null);

  const scrollToIndex = index => {
    scrollViewRef.current.scrollTo({x: index * width, y: 0, animated: true});
  };

  const [index, setIndex] = React.useState(0);
  const handleScroll = event => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / width);
    setIndex(index);
  };

  const Theme1 = () => (
    <View style={styles.themeContainer}>
      <TouchableOpacity style={styles.leftArrow}>
        <AntDesign name="left" color={colors.gray} size={30} />
      </TouchableOpacity>

      <Image
        style={styles.themeImage}
        source={require('../../assets/images/preview1.png')}
      />

      <TouchableOpacity
        onPress={() => scrollToIndex(1)}
        style={styles.rightArrow}>
        <AntDesign name="right" color={colors.white} size={30} />
      </TouchableOpacity>

      <PrimaryButton
        onPress={() => handleSelectTheme(1)}
        style={{
          marginTop: 20,
          backgroundColor: colors.theme1,
          width: width,
        }}
        title="Select theme"
      />

      <SecondaryButton
        style={{marginTop: 20}}
        title="Cancel"
        onPress={() => setThemesModal(false)}
      />
    </View>
  );

  const Theme2 = () => (
    <View style={styles.themeContainer}>
      <TouchableOpacity
        onPress={() => scrollToIndex(0)}
        style={styles.leftArrow}>
        <AntDesign name="left" color={colors.white} size={30} />
      </TouchableOpacity>

      <Image
        style={styles.themeImage}
        source={require('../../assets/images/preview2.png')}
      />

      <TouchableOpacity
        onPress={() => scrollToIndex(2)}
        style={styles.rightArrow}>
        <AntDesign name="right" color={colors.white} size={30} />
      </TouchableOpacity>

      <PrimaryButton
        onPress={() => handleSelectTheme(2)}
        style={{
          marginTop: 20,
          backgroundColor: colors.theme2,
          width: width,
        }}
        title="Select theme"
      />

      <SecondaryButton
        style={{marginTop: 20}}
        title="Cancel"
        onPress={() => setThemesModal(false)}
      />
    </View>
  );

  const Theme3 = () => (
    <View style={styles.themeContainer}>
      <TouchableOpacity
        onPress={() => scrollToIndex(1)}
        style={styles.leftArrow}>
        <AntDesign name="left" color={colors.white} size={30} />
      </TouchableOpacity>

      <Image
        style={styles.themeImage}
        source={require('../../assets/images/preview3.png')}
      />

      <TouchableOpacity style={styles.rightArrow}>
        <AntDesign name="right" color={colors.gray} size={30} />
      </TouchableOpacity>

      <PrimaryButton
        onPress={() => handleSelectTheme(3)}
        style={{
          marginTop: 20,
          backgroundColor: colors.theme3,
          width: width,
        }}
        title="Select theme"
      />

      <SecondaryButton
        style={{marginTop: 20}}
        title="Cancel"
        onPress={() => setThemesModal(false)}
      />
    </View>
  );

  async function handleSelectTheme(theme) {
    if (theme == 1) {
      setChatTheme(colors.theme1);
      await AsyncStorage.setItem('chatTheme', colors.theme1);
      setThemesModal(false);
    } else if (theme == 2) {
      setChatTheme(colors.theme2);
      await AsyncStorage.setItem('chatTheme', colors.theme2);
      setThemesModal(false);
    } else {
      setChatTheme(colors.theme3);
      await AsyncStorage.setItem('chatTheme', colors.theme3);
      setThemesModal(false);
    }
  }

  const endpoint = `${process.env.API_ENDPOINT}`;

  const flatListRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [storedChatID, setStoredChatID] = useState('');

  useEffect(() => {
    getStoredCredentials();
    getChatTheme();

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      console.log('Component has unmounted');
      setChatID('');
      setChatName('');
      setCreatedNewChat(false);
      setMessage('');

      Voice.destroy().then(Voice.removeAllListeners);

      setMessages([
        {
          messageID: '1',
          text: defaultMessage,
          image: null,
          createdAt: new Date(),
          user: `${process.env.CHAT_JULIE_ID}`,
        },
      ]);

      setMessagesToSend([]);
    };
  }, [(navigation, loading)]);

  navigation.addListener('focus', () => setLoading(!loading));

  const onSpeechStart = e => {
    console.log('onSpeechStart: ', e);
  };

  const onSpeechRecognized = e => {
    console.log('onSpeechRecognized: ', e);
  };

  const onSpeechEnd = e => {
    console.log('onSpeechEnd: ', e);
  };

  const onSpeechError = e => {
    console.log('onSpeechError: ', e);
    showMyToast({
      status: 'error',
      title: 'Failed',
      description: `An error occured while processing speech: ${e.error.message}`,
    });
  };

  const onSpeechPartialResults = e => {
    console.log('onSpeechPartialResults: ', e);
  };

  const onSpeechVolumeChanged = e => {
    console.log('onSpeechVolumeChanged: ', e);
  };

  const onSpeechResults = e => {
    console.log('onSpeechResults: ', e);

    setMessage(e.value[0]);
    setRecording(false);
    sendMessage(e.value[0]);
  };

  async function getStoredCredentials() {
    if (storedCredentials) {
      const {data} = storedCredentials;
      setUserID(data.userID);
      setToken(data.token);

      if (route.params?.chatID) {
        getConversation(route.params._id, data.token);
        setStoredChatID(route.params.chatID);
        setChatID(route.params.chatID);
        setChatName(route.params.chatName);
        setCreatedNewChat(true);
      } else {
        setChatID('');
        setChatName('');
        setCreatedNewChat(false);
        setMessage('');
      }
    }
  }

  async function getConversation(chatID, token) {
    setLoadingData(true);
    try {
      const convoData = await axios.get(
        `${endpoint}/message/get-messages/${chatID}`,
        {headers: {'auth-token': token}},
      );

      if (convoData.data.status == 'Success') {
        setLoadingData(false);
        setMessages(convoData.data.data);

        const newDataToSend = convoData.data.data.map(({role, content}) => ({
          role,
          content,
        }));

        setMessagesToSend(prevState => [...prevState, ...newDataToSend]);
      } else {
        setLoadingData(false);

        showMyToast({
          status: 'error',
          title: 'Failed',
          description: convoData.data.message,
        });
      }
    } catch (error) {
      console.log(error);
      setLoadingData(false);
      showMyToast({
        status: 'error',
        title: 'Failed',
        description: error.message,
      });
    }
  }

  function getChatTheme() {
    if (!chatTheme) {
      setThemesModal(true);
    }
  }

  async function sendMessage(message) {
    if (!message) {
      showMyToast({
        status: 'error',
        title: 'Required',
        description: 'Please write something before submitting',
      });
    } else {
      setAwaitingMessage(true);
      // flatListRef.current.scrollToEnd();

      const messageID = Math.floor(
        1000000000 + Math.random() * 9000000000,
      ).toString();

      const newMessage = {
        messageID: messageID,
        content: message,
        image: null,
        createdAt: new Date(),
        user: userID,
      };

      const newMessageToSend = {
        role: 'user',
        content: message,
      };

      if (!createdNewChat) {
        const chatID = Math.floor(
          1000000000 + Math.random() * 9000000000,
        ).toString();

        setCreatedNewChat(true);
        setChatID(chatID);
        setChatName(message);

        setMessages(prevState => [...prevState, newMessage]);
        setMessagesToSend(
          textResponse
            ? prevState => [...prevState, newMessageToSend]
            : message,
        );
        sendToOpenAI(
          textResponse ? [...messagesToSend, newMessageToSend] : message,
          messageID,
          chatID,
          message,
        );
      } else {
        setMessages(prevState => [...prevState, newMessage]);
        setMessagesToSend(
          textResponse
            ? prevState => [...prevState, newMessageToSend]
            : message,
        );
        sendToOpenAI(
          textResponse ? [...messagesToSend, newMessageToSend] : message,
          messageID,
          chatID,
          message,
        );
      }
    }
  }

  async function sendToOpenAI(dataToSend, messageID, chatID, chatName) {
    flatListRef.current.scrollToEnd();

    const imageBody = {
      prompt: chatName,
      chatID,
      chatName,
      messageID,
      user: userID,
    };

    const textBody = {
      messages: dataToSend,
      user: userID,
      content: chatName,
      messageID,
      chatID,
      chatName,
    };

    const url = textResponse
      ? `${endpoint}/text/text-completion`
      : `${endpoint}/image/generate-image`;

    try {
      let responseId = Math.floor(
        1000000000 + Math.random() * 9000000000,
      ).toString();

      await axios
        .post(url, textResponse ? textBody : imageBody, {
          headers: {'auth-token': token},
        })
        .then(response => {
          setAwaitingMessage(false);

          if (response.data.status == 'Success') {
            const aiResponse = {
              messageID: responseId,
              content: textResponse ? response.data.data : null,
              image: textResponse ? null : response.data.data,
              createdAt: new Date(),
              user: `${process.env.CHAT_JULIE_ID}`,
            };

            const aiResToSend = {
              role: 'assistant',
              content: response.data.data ? response.data.data : null,
            };

            setMessages(prevState => [...prevState, aiResponse]);
            setMessagesToSend(
              textResponse ? prevState => [...prevState, aiResToSend] : message,
            );
          } else if (response.data.accountStatus == 0) {
            navigation.navigate('ChooseSubscription', {data: null});
            showMyToast({
              status: 'info',
              title: 'Account limit alert',
              description:
                'You have reached the limit of free messages you can send. Please join premium to access unlimited functionalities',
            });
          } else {
            showMyToast({
              status: 'error',
              title: 'Failed',
              description: 'An error occured while processing your request',
            });
          }

          setMessage('');
          flatListRef.current.scrollToEnd();
        });
    } catch (error) {
      console.log(error);
      setAwaitingMessage(false);

      showMyToast({
        status: 'error',
        title: 'Failed',
        description: error.message,
      });
    }
  }

  async function handleRecord() {
    setRecording(true);
    try {
      await Voice.start('en-GB');
      Voice.onSpeechResults = onSpeechResults;
    } catch (e) {
      console.error(e);
      setRecording(false);
    }
  }

  async function stopRecording() {
    setRecording(false);
    try {
      await Voice.stop();
      Voice.onSpeechResults = onSpeechResults;
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <View
      style={[
        styles.messagingscreen,
        {
          backgroundColor:
            chatTheme == colors.theme1
              ? colors.lightOrange
              : chatTheme == colors.theme2
              ? colors.lightBlue
              : colors.lightRed,
        },
      ]}>
      <Modal isOpen={awaitingMessage}>
        <View
          style={{
            height: 70,
            width: 70,
            padding: 20,
            borderRadius: 14,
            backgroundColor: colors.black,
          }}>
          <BarIndicator color={colors.white} size={20} />
        </View>
      </Modal>

      <View style={[styles.messagingscreen, {padding: 10}]}>
        {messages[0] ? (
          <>
            <FlatList
              style={{paddingBottom: 100}}
              ref={flatListRef}
              showsVerticalScrollIndicator={false}
              data={messages}
              renderItem={({item}) => (
                <MessageItem
                  submitting={submitting}
                  key={item.messageID}
                  item={item}
                  user={userID}
                />
              )}
            />
          </>
        ) : (
          ''
        )}
      </View>

      <View style={styles.messaginginputContainer}>
        <ChatInput
          onBlur={() => {
            flatListRef.current.scrollToEnd();
          }}
          onFocus={() => {
            flatListRef.current.scrollToEnd();
          }}
          value={message}
          name="message"
          onChangeText={setMessage}
          placeholder={isRecording ? 'Listening...' : 'Write something'}
          style={styles.input}
          isDisabled={isRecording}
          // InputLeftElement={
          //   isRecording && <PulseIndicator color="red" size={40} />
          // }
          InputRightElement={
            <View style={styles.recordingComponent}>
              <TouchableOpacity
                style={globalStyles.iconRight}
                onPress={!isRecording ? handleRecord : stopRecording}>
                <Ionicons
                  name={isRecording ? 'mic' : 'ios-mic-outline'}
                  size={30}
                  color={isRecording ? 'red' : 'black'}
                />
              </TouchableOpacity>
            </View>
          }
        />

        <TouchableOpacity onPress={() => sendMessage(message)}>
          <Ionicons
            name="md-send-sharp"
            size={30}
            color={
              chatTheme == colors.theme1
                ? colors.lightOrange
                : chatTheme == colors.theme2
                ? colors.theme2
                : colors.theme3
            }
          />
        </TouchableOpacity>
      </View>

      <Modal
        style={styles.modalContainer}
        isOpen={themesModal}
        onClose={() => setThemesModal(false)}>
        <View style={styles.innerModal}>
          <ScrollView
            horizontal
            snapToInterval={width}
            snapToAlignment="center"
            contentContainerStyle={styles.imageContainer}
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}>
            <Theme1 />
            <Theme2 />
            <Theme3 />
          </ScrollView>
        </View>
      </Modal>

      <Modal isOpen={loadingData}>
        <View
          style={{
            height: 70,
            width: 70,
            padding: 20,
            borderRadius: 14,
            backgroundColor: colors.black,
          }}>
          <BarIndicator color={colors.white} size={20} />
        </View>
      </Modal>

      {isRecording && (
        <RecordingModal
          setRecording={setRecording}
          stopRecording={stopRecording}
          isOpen={isRecording}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messagingscreen: {
    flex: 1,
  },
  messaginginputContainer: {
    width: '100%',
    backgroundColor: colors.darkGray,
    paddingVertical: 20,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingComponent: {
    flexDirection: 'column',
  },
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    flex: 1,
  },
  innerModal: {},
  themeImage: {},
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  switch: {},
  themeContainer: {
    width: width,
    alignItems: 'center',
  },
  rightArrow: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: height / 2.5,
  },
  leftArrow: {
    position: 'absolute',
    alignSelf: 'flex-start',
    zIndex: 1,
    top: height / 2.5,
  },
  input: {},
});
