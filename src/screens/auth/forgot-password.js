import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import globalStyles from '../../assets/styles/global-styles';
import PrimaryInput from '../../components/inputs/primary-input';

import * as yup from 'yup';
import {Formik} from 'formik';

import PrimaryText from '../../components/texts/primary-text';
import PrimaryButton from '../../components/buttons/primary-button';
import {Image} from 'react-native';
import {Dimensions} from 'react-native';
import axios from 'axios';
import {showMyToast} from '../../functions/show-toast';

const {width} = Dimensions.get('window');

export default function ForgotPassword({route, navigation}) {
  const [submitting, setSubmitting] = useState(false);
  const url = `${process.env.API_ENDPOINT}/user/forgot-password`;

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email('Please enter valid email')
      .required('Email Address is Required'),
  });

  async function handleForgetPass(values) {
    setSubmitting(true);

    await axios
      .post(url, {email: values.email})
      .then(response => {
        console.log(response.data);
        setSubmitting(false);
        if (response.data.status == 'Success') {
          navigation.navigate('ResetPassword', {email: values.email});
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
        setSubmitting(false);

        console.log(err);
        showMyToast({
          status: 'error',
          title: 'Failed',
          description: err.message,
        });
      });
  }
  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      style={[globalStyles.container, {paddingHorizontal: 40}]}>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          email: route.params.email,
        }}
        onSubmit={values => handleForgetPass(values)}>
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
              source={require('../../assets/images/mail.png')}
            />
            <PrimaryText style={{fontSize: 20, marginVertical: 40}}>
              Please enter your email address to recieve a verification code
            </PrimaryText>

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
    marginTop: 20,
  },
});
