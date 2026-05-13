import { StyleSheet, View } from 'react-native';
import { MotiView } from 'moti';
import { colors, radius } from '@/theme/tokens';

export function StreakBar({ value, max = 7 }: { value: number; max?: number }) {
  const count = Math.max(0, Math.min(max, value));
  return (
    <View style={styles.row}>
      {Array.from({ length: max }).map((_, index) => {
        const active = index < count;
        return (
          <MotiView
            key={index}
            from={{ scaleY: 0.4, opacity: 0.35 }}
            animate={{ scaleY: active ? 1 : 0.55, opacity: active ? 1 : 0.35 }}
            transition={{ type: 'timing', duration: 360, delay: index * 45 }}
            style={[styles.segment, active && styles.active]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 5, height: 28 },
  segment: { flex: 1, height: 22, borderRadius: radius.pill, backgroundColor: colors.divider },
  active: { backgroundColor: colors.hotPink, shadowColor: colors.hotPink, shadowOpacity: 0.55, shadowRadius: 8 },
});
