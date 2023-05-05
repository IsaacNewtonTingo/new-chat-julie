import React, {useState, useEffect} from 'react';
import {View, Text, Animated} from 'react-native';

const AnimatedTextSwitch = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textArray, setTextArray] = useState([
    'App is listening',
    'Tap to stop listening',
  ]);
  const [opacityValue, setOpacityValue] = useState(new Animated.Value(1));

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex((currentIndex + 1) % textArray.length);
        setOpacityValue(new Animated.Value(0));
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentIndex, opacityValue]);

  return (
    <View>
      <Animated.Text
        style={{
          fontSize: 24,
          opacity: currentIndex === 0 ? opacityValue : 0,
          position: 'absolute',
        }}>
        {textArray[0]}
      </Animated.Text>
      <Animated.Text
        style={{
          fontSize: 24,
          opacity: currentIndex === 1 ? opacityValue : 0,
          position: 'absolute',
        }}>
        {textArray[1]}
      </Animated.Text>
    </View>
  );
};

export default AnimatedTextSwitch;
