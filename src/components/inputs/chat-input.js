import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {Icon, Input} from 'native-base';
export default function ChatInput(props) {
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
    onFocus,
    isDisabled,
  } = props;
  return (
    <Input
      borderRadius={14}
      // isDisabled={isDisabled}
      marginY={2}
      height={50}
      // maxHeight={100}
      width="85%"
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
      multiline={true}
      style={[styles.textInput, style]}
      onFocus={onFocus}
      opacity={1}
      paddingLeft={4}
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    // paddingHorizontal: 20,
  },
});
