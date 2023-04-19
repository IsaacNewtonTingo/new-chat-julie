import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import PrimaryText from '../texts/primary-text';
import colors from '../../assets/colors/colors';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {HStack} from 'native-base';

export default function SettingsList(props) {
  const {iconType, iconName, title, route} = props.setting;
  return (
    <TouchableOpacity style={styles.item}>
      <HStack space={5}>
        {iconType == 'MaterialIcons' ? (
          <MaterialIcons name={iconName} size={20} color={colors.gray} />
        ) : iconType == 'Foundation' ? (
          <Foundation name={iconName} size={20} color={colors.gray} />
        ) : iconType == 'Ionicons' ? (
          <Ionicons name={iconName} size={20} color={colors.gray} />
        ) : (
          ''
        )}
        <PrimaryText>{title}</PrimaryText>
      </HStack>
      <MaterialIcons
        name="keyboard-arrow-right"
        size={20}
        color={colors.gray}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.black,
    padding: 10,
    height: 60,
    borderBottomWidth: 0.1,
    borderBottomColor: colors.gray,
  },
});
