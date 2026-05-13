import { ReactNode } from 'react';
import { useState } from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, shadow } from '@/theme/tokens';

export function PressableCard({ children, onPress, style }: { children: ReactNode; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Pressable onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)} onPress={onPress} style={({ pressed }) => [styles.card, hovered && !pressed && styles.hovered, style, pressed && styles.pressed]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, ...shadow, cursor: 'pointer' } as any,
  hovered: { transform: [{ translateY: -4 }, { scale: 1.014 }], shadowOpacity: 0.17, shadowRadius: 22, shadowOffset: { width: 0, height: 13 }, elevation: 8 },
  pressed: { transform: [{ scale: 0.982 }, { translateY: 1 }], shadowOpacity: 0.04, elevation: 1 },
});
