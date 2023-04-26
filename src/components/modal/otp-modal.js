import {Modal} from 'native-base';
import React, {useState} from 'react';
import {StyleSheet, Dimensions, View, Pressable, Keyboard} from 'react-native';
import OTPInput from '../../components/otp/otp';

import colors from '../../assets/colors/colors';
import PrimaryText from '../../components/texts/primary-text';
import {Image} from 'react-native';
import PrimaryButton from '../../components/buttons/primary-button';
import SecondaryText from '../../components/texts/secondary-text';
import {TouchableOpacity} from 'react-native';

const {width} = Dimensions.get('window');
const B = props => (
  <SecondaryText style={{color: colors.orange}}>{props.children}</SecondaryText>
);

export default function OtpModal(props) {
  const [isPinReady, setIsPinReady] = useState(false);
  const maximumCodeLength = 4;

  const {email, otp, setOTP, setOtpModal, submitting, updateProfile} = props;

  return (
    <Modal
      style={{backgroundColor: 'rgba(0,0,0,0.8)'}}
      width="100%"
      isOpen={true}>
      <View style={styles.miniContainer}>
        <View style={styles.closeContainer}>
          <TouchableOpacity onPress={() => setOtpModal(false)}>
            <PrimaryText style={{fontSize: 25, color: colors.gray}}>
              X
            </PrimaryText>
          </TouchableOpacity>
        </View>

        <PrimaryText style={{marginVertical: 40, fontSize: 20}}>
          An OTP has been sent to <B> "{email}"</B>.
        </PrimaryText>

        <OTPInput
          code={otp}
          setCode={setOTP}
          maximumLength={maximumCodeLength}
          setIsPinReady={setIsPinReady}
        />

        <View style={{marginVertical: 40}}>
          <PrimaryText>Haven't received the verification code ?</PrimaryText>

          <TouchableOpacity>
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
          onPress={updateProfile}
          title="Submit"
          style={{width: '100%'}}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
    padding: 10,
  },
  miniContainer: {
    backgroundColor: colors.dark,
    padding: 20,
    width: width - 20,
    borderRadius: 14,
  },
  lock: {
    width: width / 2.5,
    height: width / 2.5,
    alignSelf: 'center',
  },
  closeContainer: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
});
