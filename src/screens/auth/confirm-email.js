import React, {useState} from 'react';
import {StyleSheet, Dimensions, View, Pressable, Keyboard} from 'react-native';
import OTPInput from '../../components/otp/otp';
import globalStyles, {
  ButtonContainer,
  ButtonText,
} from '../../assets/styles/global-styles';
import colors from '../../assets/colors/colors';
import PrimaryText from '../../components/texts/primary-text';
import {Image} from 'react-native';
import PrimaryButton from '../../components/buttons/primary-button';
import axios from 'axios';
import {showMyToast} from '../../functions/show-toast';
import SecondaryText from '../../components/texts/secondary-text';
import {TouchableOpacity} from 'react-native';
import LoadingScreen from '../../components/loading/page-loading';

const {width} = Dimensions.get('window');
const B = props => (
  <SecondaryText style={{color: colors.orange}}>{props.children}</SecondaryText>
);

export default function ConfirmEmail({route, navigation}) {
  const {firstName, lastName, email, password} = route.params.values;
  const [otpCode, setOTPCode] = useState('');
  const [isPinReady, setIsPinReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const maximumCodeLength = 4;

  const url = `${process.env.API_ENDPOINT}/user/register`;

  async function handleBTNPressed() {
    setSubmitting(true);
    await axios
      .post(url, {firstName, lastName, email, password, otp: otpCode})
      .then(response => {
        setSubmitting(false);
        console.log(response.data);
        if (response.data.status == 'Success') {
          navigation.navigate('Login', {email});
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

  async function resendCode() {
    setSubmitting(true);

    await axios
      .post(`${process.env.API_ENDPOINT}/user/signup`, route.params.values)
      .then(response => {
        setSubmitting(false);
        if (response.data.status == 'Success') {
          console.log(response.data);
          showMyToast({
            status: 'success',
            title: 'Success',
            description: 'OTP sent. Check your email',
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

  return (
    <Pressable style={styles.container} onPress={Keyboard.dismiss}>
      <LoadingScreen isOpen={submitting} />
      <View style={styles.miniContainer}>
        <Image
          style={styles.lock}
          source={require('../../assets/images/mail2.png')}
        />

        <PrimaryText style={{marginVertical: 40, fontSize: 20}}>
          An OTP has been sent to <B> "{email}"</B>.
        </PrimaryText>

        <OTPInput
          code={otpCode}
          setCode={setOTPCode}
          maximumLength={maximumCodeLength}
          setIsPinReady={setIsPinReady}
        />

        <View style={{marginVertical: 40}}>
          <PrimaryText>Haven't received the verification code ?</PrimaryText>

          <TouchableOpacity onPress={resendCode}>
            <SecondaryText
              style={{
                color: colors.orange,
                textDecorationLine: 'underline',
                textAlign: 'center',
              }}>
              Resend
            </SecondaryText>
          </TouchableOpacity>
        </View>

        <PrimaryButton
          submitting={submitting}
          disabled={submitting}
          onPress={handleBTNPressed}
          title="Submit"
          style={{width: '100%'}}
        />
        {/* <ButtonContainer
          disabled={!isPinReady}
          style={{
            backgroundColor: !isPinReady ? 'grey' : colors.orange,
          }}>
          <ButtonText
            style={{
              color: !isPinReady ? 'black' : '#EEEEEE',
            }}>
            Login
          </ButtonText>
        </ButtonContainer> */}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
    alignItems: 'center',
    padding: 10,
  },
  miniContainer: {
    backgroundColor: colors.black,
    padding: 20,
    width: width - 20,
    borderRadius: 14,
  },
  lock: {
    width: width / 2.5,
    height: width / 2.5,
    alignSelf: 'center',
  },
});
