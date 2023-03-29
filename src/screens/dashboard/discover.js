import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import globalStyles from '../../assets/styles/global-styles';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import colors from '../../assets/colors/colors';
import PrimaryText from '../../components/texts/primary-text';

import DiscoverItem from '../../components/cards/discover-item';
import axios from 'axios';
import History from '../../components/lists/history';
import {showMyToast} from '../../functions/show-toast';
import {Button, Modal} from 'native-base';
import SecondaryText from '../../components/texts/secondary-text';
import PrimaryButton from '../../components/buttons/primary-button';

import {CredentialsContext} from '../../context/credentials-context';

const {width, height} = Dimensions.get('window');

export default function Discover({navigation}) {
  const {storedCredentials} = useContext(CredentialsContext);

  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'Discover', title: 'Discover'},
    {key: 'History', title: 'History'},
  ]);
  const [userID, setUserID] = useState('');
  const [token, setToken] = useState('');
  const [chats, setChats] = useState([]);

  const [convoToDelete, setConvoToDelete] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getStoredCredentials();
  }, [(navigation, loading)]);

  navigation.addListener('focus', () => setLoading(!loading));

  async function getStoredCredentials() {
    if (storedCredentials) {
      const {data} = storedCredentials;
      setUserID(data.userID);
      setToken(data.token);
      getChats(data.userID, data.token);
    }
  }

  async function getChats(userID, token) {
    const url = `${process.env.API_ENDPOINT}/chat/get-user-chats/${userID}`;
    try {
      const response = await axios.get(url, {headers: {'auth-token': token}});
      if (response.data.status == 'Success') {
        setChats(response.data.data);
      } else {
        showMyToast({
          status: 'error',
          title: 'Failed',
          description: response.data.message,
        });
      }
    } catch (error) {
      console.log(error);
      showMyToast({
        status: 'error',
        title: 'Failed',
        description: error.message,
      });
    }
  }

  const discoverItems = [
    {
      iconType: 'FontAwesome',
      iconName: 'edit',
      title: 'Business documents',
      description: 'Request for email write-ups',
    },
    {
      iconType: 'MaterialCommunityIcons',
      iconName: 'code-not-equal-variant',
      title: 'Developer category',
      description: 'Generate or manipulate code',
    },
    {
      iconType: 'Entypo',
      iconName: 'image',
      title: 'Image generation',
      description: 'Generate any image',
    },
    {
      iconType: 'MaterialCommunityIcons',
      iconName: 'code-not-equal-variant',
      title: 'Summarization',
      description: 'Turn meeting notes to summary',
    },
  ];

  const discoverTab = () => {
    return (
      <FlatList
        data={discoverItems}
        renderItem={({item}) => (
          <DiscoverItem
            onPress={() => handleActionPressed(item.title)}
            item={item}
          />
        )}
      />
    );
  };

  async function handleActionPressed(title) {
    navigation.navigate('Conversation', {title});
  }

  const historyTab = () => {
    function handleDeleteConversation(convoID) {
      setConvoToDelete(convoID);
      setDeleteModal(true);
    }

    async function deleteConversation() {
      setSubmitting(true);
      const url = `${process.env.API_ENDPOINT}/chat/delete-conversation/${convoToDelete}`;
      try {
        const deleted = await axios.put(
          url,
          {},
          {headers: {'auth-token': token}},
        );
        if (deleted.data.status == 'Success') {
          getChats(userID, token);
          setSubmitting(false);
          setDeleteModal(false);
          showMyToast({
            status: 'success',
            title: 'Success',
            description: deleted.data.message,
          });
        } else {
          setSubmitting(false);

          showMyToast({
            status: 'error',
            title: 'Failed',
            description: deleted.data.message,
          });
        }
      } catch (error) {
        console.log(error);
        setSubmitting(false);

        showMyToast({
          status: 'error',
          title: 'Failed',
          description: error.message,
        });
      }
    }
    return (
      <>
        {chats.length < 1 ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <PrimaryText style={{color: colors.gray}}>
              Your conversation history will appear here
            </PrimaryText>
          </View>
        ) : (
          <View style={{flex: 1}}>
            <FlatList
              data={chats}
              renderItem={({item, i}) => (
                <History
                  item={item}
                  onDeletePress={() => handleDeleteConversation(item._id)}
                  onPress={() => {
                    navigation.navigate('Conversation', {
                      title:
                        item.chatCode == 0 ? 'Chat Julie' : 'Image generation',
                      chatID: item.chatID,
                      _id: item._id,
                      chatName: item.chatName,
                    });
                  }}
                  key={i}
                />
              )}
            />

            <Modal
              isOpen={deleteModal}
              onClose={() => setDeleteModal(false)}
              style={styles.backDrop}>
              <View style={styles.deleteModal}>
                <Modal.CloseButton />

                <SecondaryText style={{color: colors.black, fontSize: 20}}>
                  Delete conversation?
                </SecondaryText>

                <PrimaryText style={{color: colors.black, textAlign: 'left'}}>
                  Are you sure you want to delete this conversation? This action
                  is permanent and irreversible
                </PrimaryText>

                <View style={styles.modalFooter}>
                  <PrimaryButton
                    submitting={submitting}
                    disabled={submitting}
                    onPress={deleteConversation}
                    title="Delete"
                  />
                </View>
              </View>
            </Modal>
          </View>
        )}
      </>
    );
  };

  const renderTabBar = props => (
    <TabBar
      bounces
      tabStyle={{borderBottomColor: colors.gray, borderBottomWidth: 0.5}}
      {...props}
      renderLabel={({route, focused, color}) => (
        <PrimaryText
          style={{
            color: focused ? colors.white : colors.gray,
            margin: 8,
          }}>
          {route.title}
        </PrimaryText>
      )}
      indicatorStyle={{backgroundColor: colors.orange}}
      style={{backgroundColor: colors.bar}}
    />
  );

  return (
    <View style={globalStyles.container}>
      <TabView
        renderTabBar={renderTabBar}
        style={globalStyles.container}
        navigationState={{index: index, routes: routes}}
        renderScene={SceneMap({
          Discover: discoverTab,
          History: historyTab,
        })}
        onIndexChange={setIndex}
        initialLayout={{width: Dimensions.get('window').width}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backDrop: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  deleteModal: {
    height: 250,
    width: width - 40,
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 14,
    justifyContent: 'space-between',
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  deleteBTN: {
    backgroundColor: colors.orange,
  },
});
