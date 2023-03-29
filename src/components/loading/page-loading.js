import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {Modal} from 'native-base';
import {BarIndicator} from 'react-native-indicators';
import colors from '../../assets/colors/colors';

export default function LoadingScreen(props) {
  const {isOpen} = props;
  return (
    <Modal style={{backgroundColor: 'rgba(0,0,0,0.2)'}} isOpen={isOpen}>
      <View
        style={{
          height: 70,
          width: 70,
          padding: 20,
          borderRadius: 14,
          backgroundColor: colors.dark,
        }}>
        <BarIndicator color={colors.white} size={20} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({});
