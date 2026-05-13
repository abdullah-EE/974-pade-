import { useEffect, useRef, useState } from 'react';
import { Animated, StyleProp, TextStyle } from 'react-native';

export function AnimatedNumber({ value, suffix = '', prefix = '', style, duration = 680 }: { value: number; suffix?: string; prefix?: string; style?: StyleProp<TextStyle>; duration?: number }) {
  const progress = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const listener = progress.addListener(({ value: next }) => setDisplay(Math.round(next)));
    progress.setValue(0);
    Animated.timing(progress, { toValue: value, duration, useNativeDriver: false }).start();
    return () => progress.removeListener(listener);
  }, [duration, progress, value]);

  return <Animated.Text style={style}>{prefix}{display}{suffix}</Animated.Text>;
}
