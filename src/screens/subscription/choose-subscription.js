import {StyleSheet, Image, Text, View, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import globalStyles from '../../assets/styles/global-styles';
import SecondaryText from '../../components/texts/secondary-text';

import EncryptedStorage from 'react-native-encrypted-storage';

import {CredentialsContext} from '../../context/credentials-context';

import Entypo from 'react-native-vector-icons/Entypo';
import colors from '../../assets/colors/colors';
import PrimaryText from '../../components/texts/primary-text';
import {showMyToast} from '../../functions/show-toast';
import PaymentModal from '../../components/modal/payment-modal';
import {useState} from 'react';
import axios from 'axios';

const B = props => (
  <PrimaryText style={{color: colors.myGray}}>{props.children}</PrimaryText>
);

export default function ChooseSubscription({route, navigation}) {
  const {storedCredentials, setStoredCredentials} =
    useContext(CredentialsContext);

  const userID = storedCredentials ? storedCredentials.data.userID : '';
  const token = storedCredentials ? storedCredentials.data.token : '';

  const {data} = route.params;
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('');

  const [phoneNumberError, setPhoneNumberError] = useState('');

  const phoneNumberRegex = /^(07|01)\d{8}$/;

  async function storeCredentials() {
    await EncryptedStorage.setItem('userData', JSON.stringify({data}))
      .then(response => {
        if (response) {
          setStoredCredentials({data});
        } else {
          showMyToast({
            status: 'error',
            title: 'Failed',
            description: 'An error occured while trying to encrypt data',
          });
        }
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

  async function handlePaymentModal(period) {
    setPeriod(period);
    setAmount(period == 'daily' ? 20 : 500);

    setShowPaymentModal(true);
  }

  async function makePayment() {
    const amount = period == 'daily' ? 20 : 500;
    const purpose = period == 'daily' ? 1 : 2;

    if (!phoneNumber) {
      showMyToast({
        status: 'error',
        title: 'Required field',
        description: 'Phone number is required to complete this operation',
      });
    } else if (!phoneNumberRegex.test(phoneNumber)) {
      setPhoneNumberError(
        'Invalid phone number format. Use 07xxxxxxxx / 01xxxxxxxx',
      );
    } else {
      setSubmitting(true);
      setPhoneNumberError('');
      await axios
        .post(
          `${process.env.API_ENDPOINT}/premium/join-premium/${userID}`,
          {
            phoneNumber: '254' + phoneNumber.slice(1),
            amount,
            purpose,
          },
          {
            headers: {
              'auth-token': token,
            },
          },
        )
        .then(response => {
          setSubmitting(false);
          console.log(response.data);

          if (response.data.status == 'Success') {
            setShowPaymentModal(false);
            showMyToast({
              status: 'success',
              title: 'Success',
              description:
                "Payment made successfully. You're now a premium user. ENJOY!",
            });
            navigation.goBack();
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
  }

  return (
    <KeyboardAwareScrollView style={[globalStyles.container, {padding: 20}]}>
      <Image
        style={globalStyles.logoContainer}
        source={require('../../assets/images/new-logo.png')}
      />

      <PrimaryText style={{textAlign: 'center', fontSize: 25, marginTop: 20}}>
        Premium User
      </PrimaryText>

      <View style={{marginVertical: 40}}>
        <View style={styles.tickAndText}>
          <Entypo name="check" color={colors.header} size={20} />
          <PrimaryText style={styles.benefitText}>
            Unlimited <B>Questions</B>
          </PrimaryText>
        </View>

        <View style={styles.tickAndText}>
          <Entypo name="check" color={colors.header} size={20} />
          <PrimaryText style={styles.benefitText}>
            Lightning Fast <B>Responses</B>
          </PrimaryText>
        </View>

        <View style={styles.tickAndText}>
          <Entypo name="check" color={colors.header} size={20} />
          <PrimaryText style={styles.benefitText}>
            Unlimited<B> Chat History</B>
          </PrimaryText>
        </View>

        <View style={styles.tickAndText}>
          <Entypo name="check" color={colors.header} size={20} />
          <PrimaryText style={styles.benefitText}>
            24/7 <B>Support</B>
          </PrimaryText>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => handlePaymentModal('monthly')}
        style={[styles.monthlyBTN, styles.btn]}>
        <View>
          <PrimaryText style={{color: colors.white}}>Monthly</PrimaryText>
          {/* <View style={styles.saveContainer}>
            <PrimaryText style={{fontSize: 10}}>Save Ksh.120</PrimaryText>
          </View> */}
        </View>

        <PrimaryText style={{color: colors.white}}>Ksh. 500.00</PrimaryText>
      </TouchableOpacity>
{/* 
      <TouchableOpacity
        onPress={() => handlePaymentModal('daily')}
        style={[styles.dailyBTN, styles.btn]}>
        <PrimaryText style={{color: colors.white}}>Daily</PrimaryText>
        <PrimaryText style={{color: colors.white}}>Ksh.20.00</PrimaryText>
      </TouchableOpacity> */}

      {/* <View style={[globalStyles.spaceBetween, {marginVertical: 40}]}>
        <PrimaryText>Privacy Policy</PrimaryText>
        <PrimaryText>Terms of Use</PrimaryText>
      </View> */}

      <PrimaryText
        style={{marginBottom: 40, marginTop: 20, color: colors.myGray}}>
        Your subscription will automatically renew after payment
      </PrimaryText>

      {data && (
        <View style={{marginBottom: 40, alignItems: 'flex-end'}}>
          <TouchableOpacity onPress={storeCredentials} style={{}}>
            <PrimaryText>Skip</PrimaryText>
          </TouchableOpacity>
        </View>
      )}

      <PaymentModal
        amount={amount}
        submitting={submitting}
        makePayment={makePayment}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        showPaymentModal={showPaymentModal}
        setShowPaymentModal={setShowPaymentModal}
        phoneNumberError={phoneNumberError}
        period={period}
      />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  tickAndText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 18,
  },
  monthlyBTN: {
    backgroundColor: colors.heading,
  },
  dailyBTN: {
    backgroundColor: colors.myGray,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    height: 70,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  saveContainer: {
    backgroundColor: '#E8FFF3',
    paddingHorizontal: 5,
    borderRadius: 10,
  },
});
