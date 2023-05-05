import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {HStack, Modal} from 'native-base';
import {PulseIndicator} from 'react-native-indicators';
import colors from '../../assets/colors/colors';
import PrimaryText from '../texts/primary-text';
import SecondaryText from '../texts/secondary-text';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {DotIndicator} from 'react-native-indicators';

const {width} = Dimensions.get('window');

export default function RecordingModal(props) {
  const {isOpen, setRecording, stopRecording} = props;
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    micAnimation();
  }, [animation]);

  async function micAnimation() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }
  return (
    <Modal style={{backgroundColor: 'rgba(0,0,0,0.8)'}} isOpen={isOpen}>
      <TouchableOpacity
        onPress={() => {
          stopRecording();
          setRecording(false);
        }}
        style={{
          padding: 20,
          borderRadius: 14,
          //   backgroundColor: colors.dark,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <HStack alignItems="center" justifyContent="center">
          <Animated.View
            style={[
              styles.recordingComponent,
              {
                transform: [
                  {
                    scale: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.3],
                    }),
                  },
                ],
              },
            ]}>
            <Ionicons name="mic" size={30} color="red" />
          </Animated.View>
          <SecondaryText style={{textAlign: 'center', fontSize: 20}}>
            Chat Julie is Listening
            <DotIndicator color="white" size={5} style={{marginLeft: 10}} />
          </SecondaryText>
        </HStack>
        <PrimaryText style={{color: colors.gray}}>Tap to stop</PrimaryText>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({});
