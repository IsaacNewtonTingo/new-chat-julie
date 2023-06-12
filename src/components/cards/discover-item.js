import {StyleSheet, Dimensions, TouchableOpacity, View} from 'react-native';
import React from 'react';
import PrimaryText from '../texts/primary-text';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../../assets/colors/colors';
import SecondaryText from '../texts/secondary-text';

const {width} = Dimensions.get('window');

export default function DiscoverItem(props) {
  const {title, description, iconName, iconType} = props.item;
  const onPress = props.onPress;

  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <View style={styles.iconContainer}>
        {iconType == 'FontAwesome' ? (
          <FontAwesome name={iconName} size={20} color={colors.heading} />
        ) : iconType == 'Ionicons' ? (
          <Ionicons name={iconName} size={20} color={colors.heading} />
        ) : iconType == 'Entypo' ? (
          <Entypo name={iconName} size={20} color={colors.heading} />
        ) : iconType == 'MaterialCommunityIcons' ? (
          <MaterialCommunityIcons
            name={iconName}
            size={22}
            color={colors.heading}
          />
        ) : (
          <></>
        )}
      </View>

      <View>
        <SecondaryText style={{textAlign: 'left'}}>{title}</SecondaryText>
        <PrimaryText style={{textAlign: 'left', color: colors.otherGray}}>
          {description}
        </PrimaryText>
      </View>
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
    marginTop: 10,
    backgroundColor: colors.heading,
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
    width: width - 20,
    alignSelf: 'center',
  },
});
