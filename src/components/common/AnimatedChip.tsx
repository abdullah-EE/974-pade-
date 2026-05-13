import { Pressable, StyleSheet, Text } from 'react-native';
import { MotiView } from 'moti';
import { colors, radius } from '@/theme/tokens';

export function AnimatedChip({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.chip, active && styles.active, pressed && styles.pressed]}>
      <MotiView animate={{ scale: active ? 1.04 : 1 }} transition={{ type: 'timing', duration: 180 }}>
        <Text numberOfLines={1} style={[styles.text, active && styles.activeText]}>{label}</Text>
      </MotiView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.glass },
  active: { backgroundColor: colors.primary, borderColor: colors.hotPink, transform: [{ translateY: -1 }] },
  pressed: { transform: [{ scale: 0.96 }, { translateY: 1 }] },
  text: { color: colors.textSecondary, fontWeight: '900', fontSize: 13 },
  activeText: { color: '#FFFFFF' },
});
