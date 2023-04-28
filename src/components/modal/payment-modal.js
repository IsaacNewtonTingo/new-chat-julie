import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import PrimaryText from '../texts/primary-text';
import {Modal} from 'native-base';
import {TouchableOpacity} from 'react-native';
import colors from '../../assets/colors/colors';
import SecondaryText from '../texts/secondary-text';
import PrimaryInput from '../inputs/primary-input';
import PrimaryButton from '../buttons/primary-button';
import {Image} from 'react-native';
import globalStyles from '../../assets/styles/global-styles';

import {BottomSheet} from 'react-native-btr';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function PaymentModal(props) {
  const {
    showPaymentModal,
    setShowPaymentModal,
    makePayment,
    submitting,
    phoneNumber,
    setPhoneNumber,
    amount,
    phoneNumberError,
    period,
  } = props;

  return (
    <BottomSheet
      visible={showPaymentModal}
      onBackButtonPress={() => setShowPaymentModal(false)}
      onBackdropPress={() => setShowPaymentModal(false)}>
      <View style={styles.paymentContainer}>
        <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
          <PrimaryText
            style={{
              color: colors.black,
              textAlign: 'right',
              fontSize: 25,
            }}>
            X
          </PrimaryText>
        </TouchableOpacity>

        <Image
          source={require('../../assets/images/mpesa-logo.png')}
          style={styles.imageContainer}
        />

        <PrimaryText
          style={{
            color: colors.black,
            textAlign: 'left',
            marginVertical: 20,
          }}>
          You are about to make a payment of KSH. {amount} for {period}{' '}
          subscription plan. You will receive a reminder for next payment when
          the plan nears expiry.
        </PrimaryText>

        <PrimaryText style={{color: colors.black, textAlign: 'left'}}>
          Phone number
        </PrimaryText>

        <PrimaryInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="e.g 254724753175"
          InputLeftElement={() => (
            <FontAwesome name="phone-square" size={20} color={colors.gray} />
          )}
        />

        {phoneNumberError && (
          <PrimaryText
            style={{
              color: 'red',
              fontSize: 14,
              marginBottom: 10,
              textAlign: 'left',
            }}>
            {phoneNumberError}
          </PrimaryText>
        )}

        <PrimaryText style={{color: colors.black, textAlign: 'left'}}>
          Amount
        </PrimaryText>

        <PrimaryInput
          styles={{marginBottom: 20}}
          editable={false}
          value={`KSH. ${amount.toString()}`}
          InputLeftElement={() => (
            <FontAwesome name="phone-square" size={20} color={colors.gray} />
          )}
        />

        <PrimaryButton
          style={{marginTop: 20}}
          submitting={submitting}
          disabled={submitting}
          onPress={makePayment}
          title="Make payment"
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  paymentContainer: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
  },
  imageContainer: {
    width: 100,
    height: 30,
  },
});
