import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

export default function PrimaryText(props) {
  const {style, selectable} = props;
  return (
    <Text selectable={selectable} style={[styles.primaryText, style]}>
      {props.children}
    </Text>
  );
}

const styles = StyleSheet.create({
  primaryText: {
    color: '#046D71',
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 26,
  },
});
