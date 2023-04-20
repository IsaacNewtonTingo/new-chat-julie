import {Image, StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import React, {useContext, useState} from 'react';
import globalStyles from '../../assets/styles/global-styles';
import PrimaryText from '../../components/texts/primary-text';
import {HStack} from 'native-base';

import Entypo from 'react-native-vector-icons/Entypo';
import colors from '../../assets/colors/colors';

import {CredentialsContext} from '../../context/credentials-context';
import EncryptedStorage from 'react-native-encrypted-storage';
import {showMyToast} from '../../functions/show-toast';

import SettingsList from '../../components/lists/settings-list';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MyToast from '../../components/toasts/my-toast';
import axios from 'axios';

export default function Settings({navigation}) {
  const {storedCredentials, setStoredCredentials} =
    useContext(CredentialsContext);

  const userID = storedCredentials.data;

  const [user, setUser] = useState({});

  const paymentSettings = [
    {
      title: 'Premium',
      iconName: 'crown',
      iconType: 'Foundation',
      route: 'Premium',
    },
    {
      title: 'Transactions',
      iconName: 'payments',
      iconType: 'MaterialIcons',
      route: 'Transactions',
    },
  ];

  const setSettings = [
    {
      title: 'Notification Settings',
      iconName: 'notifications-circle-outline',
      iconType: 'Ionicons',
      route: 'Notifications',
    },
    {
      title: 'Theme Settings',
      iconName: 'color-palette-outline',
      iconType: 'Ionicons',
      route: 'ThemeSettings',
    },
  ];

  useEffect(() => {
    getUserData();
  }, []);

  async function getUserData() {
    try {
      const response = await axios.get(
        `${process.env.API_ENDPOINT}/user/get-user/${userID}`,
      );
      if (response.data.status == 'success') {
        setUser(response.data.data);
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
        description: 'An error occured while gettings user data',
      });
    }
  }

  async function handleLogout() {
    await EncryptedStorage.removeItem('userData')
      .then(() => {
        setStoredCredentials(null);
      })
      .catch(err => {
        console.log(err);
        showMyToast({
          status: 'error',
          title: 'Failed',
          description: err.message,
        });
      });
  }
  return (
    <View style={[globalStyles.container, {position: 'relative'}]}>
      <TouchableOpacity style={styles.userDetailsContainer}>
        <HStack alignItems="center">
          <View style={styles.imageContainer}>
            <Image
              style={styles.profileIMG}
              source={{
                uri: user.avatar
                  ? user.avatar
                  : 'https://1fid.com/wp-content/uploads/2022/06/no-profile-picture-4-1024x1024.jpg',
              }}
            />
            {/* <SecondaryText style={{fontSize: 20}}>J</SecondaryText> */}
          </View>

          <View style={styles.right}>
            <PrimaryText style={{textAlign: 'left'}}>
              {user.firstName} {user.lastName}
            </PrimaryText>
            <PrimaryText style={{textAlign: 'left', color: colors.gray}}>
              View profile
            </PrimaryText>
          </View>
        </HStack>
      </TouchableOpacity>

      <View style={{marginTop: 20}}>
        {paymentSettings.map((setting, i) => (
          <SettingsList key={i} setting={setting} />
        ))}
      </View>

      <View style={{marginTop: 20}}>
        {setSettings.map((setting, i) => (
          <SettingsList key={i} setting={setting} />
        ))}
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutBTN}>
        <HStack space={5}>
          <Entypo name="log-out" size={20} color={colors.gray} />
          <PrimaryText>Signout</PrimaryText>
        </HStack>

        <MaterialIcons
          name="keyboard-arrow-right"
          size={20}
          color={colors.gray}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: 65,
    height: 65,
    borderRadius: 40,
    backgroundColor: colors.lightBlue,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetailsContainer: {
    backgroundColor: colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 14,
  },
  right: {
    marginLeft: 20,
  },
  profileIMG: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  logoutBTN: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.black,
    padding: 10,
    marginTop: 20,
    height: 60,
  },
});
