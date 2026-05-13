import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { MotiView } from 'moti';
import { colors, radius, spacing } from '@/theme/tokens';

export function FilterChips({ items, active, onChange }: { items: string[]; active: string; onChange: (value: string) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {items.map((item) => (
        <Pressable key={item} onPress={() => onChange(item)} style={({ pressed }) => [styles.chip, active === item && styles.active, pressed && styles.pressed]}>
          <MotiView animate={{ scale: active === item ? 1.04 : 1 }} transition={{ type: 'timing', duration: 180 }}>
            <Text numberOfLines={1} style={[styles.text, active === item && styles.activeText]}>{item}</Text>
          </MotiView>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingRight: spacing.md },
  chip: { paddingHorizontal: spacing.md, paddingVertical: 9, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.glass },
  active: { backgroundColor: colors.primary, borderColor: colors.hotPink, shadowColor: colors.hotPink, shadowOpacity: 0.4, shadowRadius: 12 },
  pressed: { transform: [{ scale: 0.96 }, { translateY: 1 }] },
  text: { color: colors.textSecondary, fontWeight: '800', fontSize: 13 },
  activeText: { color: '#FFFFFF' },
});
