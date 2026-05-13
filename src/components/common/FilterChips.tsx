import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';

export function FilterChips({ items, active, onChange }: { items: string[]; active: string; onChange: (value: string) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {items.map((item) => (
        <Pressable key={item} onPress={() => onChange(item)} style={({ pressed }) => [styles.chip, active === item && styles.active, pressed && styles.pressed]}>
          <Text style={[styles.text, active === item && styles.activeText]}>{item}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingRight: spacing.md },
  chip: { paddingHorizontal: spacing.md, paddingVertical: 9, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: '#FFFFFF' },
  active: { backgroundColor: colors.primary, borderColor: colors.primary },
  pressed: { transform: [{ scale: 0.96 }, { translateY: 1 }] },
  text: { color: colors.textSecondary, fontWeight: '800', fontSize: 13 },
  activeText: { color: '#FFFFFF' },
});
