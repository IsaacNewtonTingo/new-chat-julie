import {StyleSheet} from 'react-native';
import colors from '../colors/colors';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  logoContainer: {
    alignSelf: 'center',
    width: 70,
    height: 100,
  },
  label: {
    textAlign: 'left',
    fontSize: 14,
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    fontSize: 10,
    color: 'red',
    textAlign: 'left',
    marginBottom: 10,
  },
  iconRight: {
    marginRight: 10,
  },
});

export default globalStyles;

import styled from 'styled-components/native';

export const OTPInputContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

export const TextInputHidden = styled.TextInput`
  /* width: 300px;
  border-color: #046D71;
  border-width: 1px;
  border-radius: 5px;
  padding: 15px;
  margin-top: 50px;
  color: #046D71; */
  position: absolute;
  opacity: 0;
`;

export const SplitOTPBoxesContainer = styled.Pressable`
  width: 80%;
  flex-direction: row;
  justify-content: space-evenly;
`;
export const SplitBoxes = styled.View`
  border-color: #046d71;
  border-width: 2px;
  border-radius: 5px;
  padding: 12px;
  min-width: 50px;
`;

export const SplitBoxText = styled.Text`
  font-size: 20px;
  text-align: center;
  color: #046d71;
`;

export const SplitBoxesFocused = styled(SplitBoxes)`
  border-color: #046d71;
`;

export const ButtonContainer = styled.TouchableOpacity`
  background-color: #000000;
  padding: 20px;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 30px;
  border-radius: 14px;
`;

export const ButtonText = styled.Text`
  color: black;
  font-size: 20px;
`;
