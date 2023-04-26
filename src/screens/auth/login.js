import {
  Alert,
  Button,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useContext, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CheckBox from '@react-native-community/checkbox';

import {showMyToast} from '../../functions/show-toast';
import {Formik} from 'formik';
import * as yup from 'yup';

import PrimaryText from '../../components/texts/primary-text';
import globalStyles from '../../assets/styles/global-styles';
import PrimaryInput from '../../components/inputs/primary-input';
import PrimaryButton from '../../components/buttons/primary-button';

import {TouchableOpacity} from 'react-native';
import {HStack, Flex, Divider} from 'native-base';
import colors from '../../assets/colors/colors';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import axios from 'axios';
import {Dimensions} from 'react-native';

import {SocialIcon} from 'react-native-elements';
import EncryptedStorage from 'react-native-encrypted-storage';

import {CredentialsContext} from '../../context/credentials-context';
const {width} = Dimensions.get('window');

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import LoadingScreen from '../../components/loading/page-loading';

export default function Login({navigation, route}) {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const {storedCredentials, setStoredCredentials} =
    useContext(CredentialsContext);

  const [loggedIn, setloggedIn] = useState(false);
  const [userInfo, setuserInfo] = useState([]);

  const [userName, setUserName] = useState('');
  const [token, setToken] = useState('');
  const [profilePic, setProfilePic] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [processingGoogleLogin, setProcessingGoogleLogin] = useState(false);

  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email('Please enter valid email')
      .required('Email Address is Required'),
    password: yup
      .string()
      .min(8, ({min}) => `Password must be at least ${min} characters`)
      .required('Password is required'),
  });

  async function handleLogin(values, toggleCheckBox) {
    try {
      setSubmitting(true);
      const response = await axios.post(
        `${process.env.API_ENDPOINT}/user/login`,
        values,
      );

      if (response.data.status == 'Success') {
        setSubmitting(false);
        const {data} = response.data;

        if (data.premium == 0) {
          navigation.navigate('AuthSubscription', {data});
        } else {
          storeCredentials({data});
        }
      } else {
        setSubmitting(false);

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

  async function storeCredentials(data) {
    await EncryptedStorage.setItem('userData', JSON.stringify(data))
      .then(() => {
        setStoredCredentials(data);
        setSubmitting(false);
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

  async function loginWithGoogle() {
    setProcessingGoogleLogin(true);
    GoogleSignin.configure({
      androidClientId: process.env.ANDROID_CLIENT_ID,
      webClientId: process.env.WEB_CLIENT_ID,
      offlineAccess: true,
    });
    await GoogleSignin.hasPlayServices()
      .then(async hasPlayService => {
        if (hasPlayService) {
          await GoogleSignin.signIn()
            .then(async userInfo => {
              const data = {
                given_name: userInfo.user.givenName,
                family_name: userInfo.user.familyName,
                picture: userInfo.user.photo,
                email: userInfo.user.email,
                idToken: userInfo.user.idToken,
              };

              console.log(data);

              await axios
                .post(`${process.env.API_ENDPOINT}/user/google-login`, data)
                .then(response => {
                  console.log(response.data);
                  setProcessingGoogleLogin(false);

                  if (response.data.status == 'Success') {
                    const {data} = response.data;

                    if (data.premium == 0) {
                      navigation.navigate('AuthSubscription', {data});
                    } else {
                      storeCredentials({data});
                    }
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
                  showMyToast({
                    status: 'error',
                    title: 'Failed',
                    description: 'An error occured while logging in',
                  });
                });
            })
            .catch(e => {
              console.log('ERROR IS: ' + JSON.stringify(e));
            });
        }
      })
      .catch(e => {
        console.log('ERROR IS: ' + JSON.stringify(e));
        setProcessingGoogleLogin(false);
      });
  }

  async function loginWithFacebook() {
    // await LoginManager.logInWithPermissions(['public_profile', 'email']).then(
    //   async function (result) {
    //     if (result.isCancelled) {
    //       console.log('==> Login cancelled');
    //     } else {
    //       const data = await AccessToken.getCurrentAccessToken();
    //       console.log(data);
    //       console.log(
    //         '==> Login success with permissions: ' +
    //           result.grantedPermissions.toString(),
    //       );
    //     }
    //   },
    //   function (error) {
    //     console.log('==> Login fail with error: ' + error);
    //   },
    // );

    showMyToast({
      status: 'info',
      title: 'Info',
      description: 'Comming soon',
    });
  }

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      style={globalStyles.container}>
      <Image
        style={globalStyles.logoContainer}
        source={require('../../assets/images/dfLogo.png')}
      />

      <PrimaryText style={{fontSize: 20}}>Login to your account</PrimaryText>

      <Formik
        validationSchema={loginValidationSchema}
        initialValues={{
          email: route.params.email,
          password: '',
        }}
        onSubmit={values => handleLogin(values, toggleCheckBox)}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
          isSubmitting,
        }) => (
          <View style={styles.formContainer}>
            <PrimaryText style={globalStyles.label}>Email</PrimaryText>
            <PrimaryInput
              name="email"
              placeholder="Type your email address here"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
              style={styles.input}
            />

            {errors.email && touched.email && (
              <PrimaryText style={globalStyles.errorText}>
                {errors.email}
              </PrimaryText>
            )}

            <PrimaryText style={globalStyles.label}>Password</PrimaryText>

            <View>
              <PrimaryInput
                name="password"
                placeholder="********"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry={!showPass}
                style={styles.input}
                InputRightElement={
                  <Pressable
                    style={globalStyles.iconRight}
                    onPress={() => setShowPass(!showPass)}>
                    <FontAwesome
                      name={showPass ? 'eye' : 'eye-slash'}
                      size={20}
                      color="black"
                    />
                  </Pressable>
                }
              />
            </View>

            {errors.password && touched.password && (
              <PrimaryText style={globalStyles.errorText}>
                {errors.password}
              </PrimaryText>
            )}

            <View style={globalStyles.spaceBetween}>
              <HStack alignItems="center">
                <CheckBox
                  tintColors={true ? 'red' : 'white'}
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                />

                <PrimaryText style={globalStyles.label}>
                  Remember me
                </PrimaryText>
              </HStack>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ForgotPassword', {email: ''})
                }>
                <PrimaryText
                  style={[globalStyles.label, {color: colors.orange}]}>
                  Forgot password?
                </PrimaryText>
              </TouchableOpacity>
            </View>

            <PrimaryButton
              title="Login"
              onPress={handleSubmit}
              disabled={!isValid}
              submitting={submitting}
              style={{marginVertical: 20}}
            />

            <View style={styles.dividerContainer}>
              <Divider
                bg={colors.gray}
                thickness="0.5"
                mx="2"
                w={width / 3}
                orientation="horizontal"
              />
              <PrimaryText>Or</PrimaryText>
              <Divider
                bg={colors.gray}
                thickness="0.5"
                w={width / 3}
                mx="2"
                orientation="horizontal"
              />
            </View>

            <HStack alignItems="center" justifyContent="center">
              <SocialIcon
                onPress={loginWithFacebook}
                style={styles.socialBTNs}
                type="facebook"
              />

              <TouchableOpacity>
                <SocialIcon
                  onPress={loginWithGoogle}
                  style={styles.socialBTNs}
                  type="google"
                />
              </TouchableOpacity>
            </HStack>

            <HStack marginTop={5} alignItems="center" justifyContent="center">
              <PrimaryText>Don't have an account ? </PrimaryText>

              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <PrimaryText style={{color: colors.orange}}>
                  Signup here
                </PrimaryText>
              </TouchableOpacity>
            </HStack>
          </View>
        )}
      </Formik>

      {processingGoogleLogin && (
        <LoadingScreen isOpen={processingGoogleLogin} />
      )}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    width: '80%',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    elevation: 10,
    backgroundColor: '#e6e6e6',
  },
  textInput: {
    height: 40,
    width: '100%',
    margin: 10,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
  },

  formContainer: {
    padding: 40,
  },
  input: {
    marginVertical: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialBTNs: {
    // borderRadius: 14,
  },
});
