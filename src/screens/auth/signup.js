import {Button, Image, StyleSheet, Text, Pressable, View} from 'react-native';
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

export default function Signup({navigation}) {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loginValidationSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup
      .string()
      .email('Please enter valid email')
      .required('Email Address is Required'),
    password: yup
      .string()
      .min(8, ({min}) => `Password must be at least ${min} characters`)
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .min(8, ({min}) => `Password must be at least ${min} characters`)
      .required('Password is required'),
  });

  async function handleSignup(values) {
    if (!toggleCheckBox) {
      showMyToast({
        status: 'error',
        title: 'Required field',
        description:
          'Please check the terms and conditions to proceed with account creation',
      });
    } else {
      setSubmitting(true);

      await axios
        .post(`${process.env.API_ENDPOINT}/user/signup`, values)
        .then(response => {
          setSubmitting(false);
          if (response.data.status == 'Success') {
            console.log(response.data);

            navigation.navigate('ConfirmEmail', {
              values: {
                ...values,
                userID: null,
                headers: null,
              },
            });

            showMyToast({
              status: 'success',
              title: 'Success',
              description: response.data.message,
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
          console.log(err);
          setSubmitting(false);
          showMyToast({
            status: 'error',
            title: 'Failed',
            description: err.message,
          });
        });
    }
  }

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      style={globalStyles.container}>
      <Image
        style={globalStyles.logoContainer}
        source={require('../../assets/images/dfLogo.png')}
      />

      <PrimaryText style={{fontSize: 20}}>Create account</PrimaryText>

      <Formik
        validationSchema={loginValidationSchema}
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        onSubmit={values => handleSignup(values)}>
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
            <PrimaryText style={globalStyles.label}>First name</PrimaryText>
            <PrimaryInput
              name="firstName"
              placeholder="e.g John Doe"
              onChangeText={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              value={values.firstName}
              style={styles.input}
            />

            {errors.firstName && touched.firstName && (
              <PrimaryText style={globalStyles.errorText}>
                {errors.firstName}
              </PrimaryText>
            )}

            <PrimaryText style={globalStyles.label}>Last name</PrimaryText>
            <PrimaryInput
              name="lastName"
              placeholder="e.g John Doe"
              onChangeText={handleChange('lastName')}
              onBlur={handleBlur('lastName')}
              value={values.lastName}
              style={styles.input}
            />

            {errors.lastName && touched.lastName && (
              <PrimaryText style={globalStyles.errorText}>
                {errors.lastName}
              </PrimaryText>
            )}

            <PrimaryText style={globalStyles.label}>Email</PrimaryText>
            <PrimaryInput
              name="email"
              placeholder="e.g johndoe@gmail.com"
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
            {errors.password && touched.password && (
              <PrimaryText style={globalStyles.errorText}>
                {errors.password}
              </PrimaryText>
            )}

            <PrimaryText style={globalStyles.label}>
              Confirm password
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

            <View style={globalStyles.spaceBetween}>
              <HStack alignItems="center">
                <CheckBox
                  tintColors={true ? 'red' : 'white'}
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                />

                <HStack>
                  <PrimaryText style={globalStyles.label}>
                    I agree to the{' '}
                  </PrimaryText>

                  <TouchableOpacity>
                    <PrimaryText
                      style={[globalStyles.label, {color: colors.orange}]}>
                      terms and conditions
                    </PrimaryText>
                  </TouchableOpacity>
                </HStack>
              </HStack>
            </View>

            <PrimaryButton
              title="Create account"
              onPress={handleSubmit}
              disabled={!isValid}
              submitting={submitting}
              style={{marginVertical: 20}}
            />

            <HStack alignItems="center" justifyContent="center">
              <PrimaryText>Already have an account ? </PrimaryText>

              <TouchableOpacity onPress={() => navigation.goBack()}>
                <PrimaryText style={{color: colors.orange}}>
                  Login here
                </PrimaryText>
              </TouchableOpacity>
            </HStack>
          </View>
        )}
      </Formik>
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
});
