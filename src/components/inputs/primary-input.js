import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {Icon, Input} from 'native-base';
export default function PrimaryInput(props) {
  const {
    value,
    name,
    onChangeText,
    placeholder,
    style,
    secureTextEntry,
    onBlur,
    handleBlur,
    InputRightElement,
    InputLeftElement,
    editable,
    autoCapitalize,
  } = props;
  return (
    <Input
      editable={editable}
      borderRadius={14}
      marginY={2}
      height={50}
      backgroundColor="white"
      name={name}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      onBlur={onBlur}
      handleBlur={handleBlur}
      InputRightElement={InputRightElement}
      InputLeftElement={InputLeftElement}
      style={[styles.textInput, style]}
      autoCapitalize={autoCapitalize}
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    height: 50,
    borderRadius: 14,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
});
