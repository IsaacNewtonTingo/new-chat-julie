import {Image, StyleSheet, Dimensions, View} from 'react-native';
import React, {useState, useContext} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import globalStyles from '../../assets/styles/global-styles';
import colors from '../../assets/colors/colors';
import PrimaryText from '../../components/texts/primary-text';
import PrimaryInput from '../../components/inputs/primary-input';
import PrimaryButton from '../../components/buttons/primary-button';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';

import {Icon} from 'native-base';
import {ImageBackground} from 'react-native';
import {TouchableOpacity} from 'react-native';
import axios from 'axios';

import {CredentialsContext} from '../../context/credentials-context';
import {showMyToast} from '../../functions/show-toast';
import OtpModal from '../../components/modal/otp-modal';

const {width} = Dimensions.get('window');
export default function Profile({navigation, route}) {
  const {user} = route.params;
  const [data, setData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    avatar: user.avatar,

    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',

    otp: '',
  });

  const [otpModal, setOtpModal] = useState(true);
  const [processing, setProcessing] = useState(false);

  const {storedCredentials} = useContext(CredentialsContext);

  const userID = storedCredentials.data.userID;
  const token = storedCredentials.data.token;

  const headers = {
    'auth-token': token,
  };

  async function updateProfileRequest() {
    setProcessing(true);
    await axios
      .patch(
        `${process.env.API_ENDPOINT}/user/update-profile-request/${userID}`,
        data,
        {headers},
      )
      .then(async response => {
        setProcessing(false);

        if (response.data.status == 'Complete') {
          //profile was updated successfully. Email didn't change
          showMyToast({
            status: 'success',
            title: 'Success',
            description: response.data.message,
          });
        } else if (response.data.status == 'Success') {
          //A new email was input
          //otp was sent and you need to call a second route
          setOtpModal(true);
        } else {
          showMyToast({
            status: 'error',
            title: 'Failed',
            description: response.data.message,
          });
        }
      })
      .catch(err => {
        console.log(err);
        setProcessing(false);
        showMyToast({
          status: 'error',
          title: 'Failed',
          description: 'An error occured while updating profile',
        });
      });
  }

  async function updateProfile() {
    setProcessing(true);
    await axios
      .patch(
        `${process.env.API_ENDPOINT}/user/update-profile/${userID}`,
        data,
        {headers},
      )
      .then(response => {
        setProcessing(false);

        if (response.data.status == 'Success') {
          showMyToast({
            status: 'success',
            title: 'Success',
            description: response.data.message,
          });
        } else {
          setProcessing(false);

          showMyToast({
            status: 'error',
            title: 'Failed',
            description: response.data.message,
          });
        }
      });
  }
  return (
    <KeyboardAwareScrollView style={globalStyles.container}>
      <ImageBackground
        source={require('../../assets/images/bg.jpg')}
        style={styles.imageContainer}>
        <ImageBackground
          style={styles.image}
          imageStyle={{borderRadius: 300}}
          source={{
            uri: data.avatar
              ? data.avatar
              : 'https://1fid.com/wp-content/uploads/2022/06/no-profile-picture-4-1024x1024.jpg',
          }}>
          <TouchableOpacity>
            <Entypo
              name="camera"
              size={40}
              color={colors.orange}
              // style={styles.editIcon}
            />
          </TouchableOpacity>
        </ImageBackground>
      </ImageBackground>

      <View style={styles.container}>
        <PrimaryText
          style={{textAlign: 'left', fontSize: 25, color: colors.orange}}>
          Personal information
        </PrimaryText>

        <PrimaryText style={{textAlign: 'left', marginTop: 20}}>
          First name
        </PrimaryText>
        <PrimaryInput
          placeholder="e.g John"
          value={data.firstName}
          onChangeText={text => setData({firstName: text})}
          InputLeftElement={
            <Icon
              as={<Ionicons name="person" />}
              size={5}
              ml="2"
              color="muted.400"
            />
          }
        />

        <PrimaryText style={{textAlign: 'left', marginTop: 20}}>
          Last name
        </PrimaryText>
        <PrimaryInput
          placeholder="e.g John"
          value={data.lastName}
          onChangeText={text => setData({lastName: text})}
          InputLeftElement={
            <Icon
              as={<Ionicons name="person" />}
              size={5}
              ml="2"
              color="muted.400"
            />
          }
        />

        <PrimaryText style={{textAlign: 'left', marginTop: 20}}>
          Email
        </PrimaryText>
        <PrimaryInput
          placeholder="e.g John"
          value={data.email}
          onChangeText={text => setData({email: text})}
          InputLeftElement={
            <Icon
              as={<Entypo name="mail" />}
              size={5}
              ml="2"
              color="muted.400"
            />
          }
        />

        <PrimaryButton
          title="Update"
          style={{marginTop: 20}}
          InputLeftElement={
            <Icon
              as={<Entypo name="mail" />}
              size={5}
              ml="2"
              color="muted.400"
            />
          }
        />
      </View>

      <View style={styles.container}>
        <PrimaryText
          style={{textAlign: 'left', fontSize: 25, color: colors.orange}}>
          Change password
        </PrimaryText>

        <PrimaryText style={{textAlign: 'left', marginTop: 20}}>
          Current password
        </PrimaryText>
        <PrimaryInput
          placeholder="e.g John"
          value={data.oldPassword}
          onChangeText={text => setData({oldPassword: text})}
          InputLeftElement={
            <Icon
              as={<Feather name="lock" />}
              size={5}
              ml="2"
              color="muted.400"
            />
          }
        />

        <PrimaryText style={{textAlign: 'left', marginTop: 20}}>
          New password
        </PrimaryText>
        <PrimaryInput
          placeholder="e.g John"
          value={data.newPassword}
          onChangeText={text => setData({newPassword: text})}
          InputLeftElement={
            <Icon
              as={<Feather name="lock" />}
              size={5}
              ml="2"
              color="muted.400"
            />
          }
        />

        <PrimaryText style={{textAlign: 'left', marginTop: 20}}>
          Confirm new password
        </PrimaryText>
        <PrimaryInput
          placeholder="e.g John"
          value={data.confirmNewPassword}
          onChangeText={text => setData({confirmNewPassword: text})}
          InputLeftElement={
            <Icon
              as={<Feather name="lock" />}
              size={5}
              ml="2"
              color="muted.400"
            />
          }
        />

        <PrimaryButton
          onPress={updateProfileRequest}
          disabled={processing}
          submitting={processing}
          title="Update password"
          style={{marginTop: 20}}
        />
      </View>

      {otpModal && (
        <OtpModal
          otp={data.otp}
          email={data.email}
          updateProfile={updateProfile}
          processing={processing}
          disabled={processing}
          submitting={processing}
        />
      )}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: width,
    height: width / 1.7,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width / 2,
    height: width / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: 40,
    marginTop: 20,
    backgroundColor: colors.black,
  },
  editIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
});
