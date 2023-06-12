import {
  Button,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  Pressable,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import {HStack} from 'native-base';
import colors from '../../assets/colors/colors';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import OTPInput from '../../components/otp/otp';
import SecondaryText from '../../components/texts/secondary-text';

const {width} = Dimensions.get('window');

const B = props => (
  <SecondaryText style={{color: colors.myGray}}>{props.children}</SecondaryText>
);

export default function ResetPassword({route, navigation}) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [otpCode, setOTPCode] = useState('');
  const [isPinReady, setIsPinReady] = useState(false);

  const maximumCodeLength = 4;

  const [submitting, setSubmitting] = useState(false);

  const url = `${process.env.API_ENDPOINT}/user/reset-password`;

  const validationSchema = yup.object().shape({
    password: yup
      .string()
      .min(8, ({min}) => `Password must be at least ${min} characters`)
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .min(8, ({min}) => `Password must be at least ${min} characters`)
      .required('Password is required'),
  });

  async function resetPassword(values) {
    if (otpCode) {
      setSubmitting(true);
      console.log(values);

      await axios
        .post(url, {
          email: values.email,
          password: values.password,
          otp: otpCode,
        })
        .then(response => {
          console.log(response.data);
          setSubmitting(false);
          if (response.data.status == 'Success') {
            navigation.navigate('Login', {email: values.email});
            showMyToast({
              status: 'success',
              title: 'Success',
              description: `${response.data.message}. Please login`,
            });
          } else {
            showMyToast({
              status: 'error',
              title: 'Failed',
              description: response.data.message,
            });
          }
        })
        .catch(err => {
          setSubmitting(false);

          console.log(err);
          showMyToast({
            status: 'error',
            title: 'Failed',
            description: err.message,
          });
        });
    } else {
      showMyToast({
        status: 'error',
        title: 'Failed',
        description: 'OTP is required',
      });
    }
  }

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      style={[globalStyles.container, {paddingHorizontal: 40}]}>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          email: route.params.email,
          password: '',
          confirmPassword: '',
        }}
        onSubmit={values => resetPassword(values)}>
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
            <Image
              style={styles.lock}
              source={require('../../assets/images/lock.png')}
            />
            <PrimaryText style={{fontSize: 20, marginBottom: 40}}>
              Please enter the verification code sent to{' '}
              <B>{route.params.email}</B>
            </PrimaryText>

            {/* <PrimaryText style={globalStyles.label}>OTP</PrimaryText> */}
            <OTPInput
              code={otpCode}
              setCode={setOTPCode}
              maximumLength={maximumCodeLength}
              setIsPinReady={setIsPinReady}
            />

            {/* {errors.otp && touched.otp && (
              <PrimaryText style={globalStyles.errorText}>
                {errors.otp}
              </PrimaryText>
            )} */}

            <PrimaryText style={[globalStyles.label, {marginTop: 20}]}>
              New password
            </PrimaryText>

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

            <PrimaryText style={globalStyles.label}>
              Confirm new password
            </PrimaryText>

            <PrimaryInput
              name="confirmPassword"
              placeholder="********"
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
              secureTextEntry={!showConfirmPass}
              style={styles.input}
              InputRightElement={
                <Pressable
                  style={globalStyles.iconRight}
                  onPress={() => setShowConfirmPass(!showConfirmPass)}>
                  <FontAwesome
                    name={showConfirmPass ? 'eye' : 'eye-slash'}
                    size={20}
                    color="black"
                  />
                </Pressable>
              }
            />

            {errors.confirmPassword && touched.confirmPassword && (
              <PrimaryText style={globalStyles.errorText}>
                {errors.confirmPassword}
              </PrimaryText>
            )}

            <PrimaryButton
              title="Submit"
              onPress={handleSubmit}
              disabled={!isValid}
              submitting={submitting}
              style={{marginVertical: 20}}
            />
          </View>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  lock: {
    width: width / 2.5,
    height: width / 2.5,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
