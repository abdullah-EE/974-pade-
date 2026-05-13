import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors, radius } from '@/theme/tokens';

export function ProgressBar({ value, color = colors.hotPink }: { value: number; color?: string }) {
  const width = useRef(new Animated.Value(0)).current;
  const pct = Math.max(0, Math.min(100, value));

  useEffect(() => {
    Animated.timing(width, { toValue: pct, duration: 760, useNativeDriver: false }).start();
  }, [pct, width]);

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { backgroundColor: color, width: width.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 10, borderRadius: radius.pill, backgroundColor: colors.divider, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  fill: { height: '100%', borderRadius: radius.pill, shadowColor: colors.hotPink, shadowOpacity: 0.7, shadowRadius: 12 },
});
