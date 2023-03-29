import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import colors from '../../assets/colors/colors';
import PrimaryText from '../texts/primary-text';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SecondaryText from '../texts/secondary-text';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

const {width} = Dimensions.get('window');

export default function History(props) {
  const {item, onDeletePress, onPress} = props;
  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="robot-outline"
          size={40}
          color={colors.gray}
        />
      </View>

      <View style={{flex: 1, padding: 10}}>
        <PrimaryText style={{textAlign: 'left'}}>
          {item.chatName.length <= 80
            ? item.chatName
            : item.chatName.slice(0, 79) + '...'}
        </PrimaryText>
      </View>

      <TouchableOpacity onPress={onDeletePress}>
        <FontAwesome name="trash" color={colors.gray} size={25} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: colors.white,
    borderRadius: 10,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: colors.black,
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
    width: width,
    justifyContent: 'space-between',
  },
});
