import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius } from '@/theme/tokens';

export function FloatingActionCard({
  title,
  meta,
  icon,
  dark,
  onPress,
}: {
  title: string;
  meta: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  dark?: boolean;
  onPress: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Pressable onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)} onPress={onPress} style={({ pressed }) => [styles.card, dark && styles.dark, hovered && !pressed && styles.hovered, pressed && styles.pressed]}>
      <MaterialCommunityIcons name={icon} size={22} color={dark ? colors.pearl : colors.hotPink} />
      <Text style={[styles.title, dark && styles.titleDark]}>{title}</Text>
      <Text style={[styles.meta, dark && styles.metaDark]}>{meta}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minHeight: 116, borderRadius: radius.lg, padding: 13, justifyContent: 'space-between', backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.border, shadowColor: '#000000', shadowOpacity: 0.18, shadowRadius: 16, shadowOffset: { width: 0, height: 10 }, elevation: 5, cursor: 'pointer' } as any,
  dark: { backgroundColor: colors.primary, borderColor: 'rgba(255,111,155,0.34)' },
  hovered: { transform: [{ translateY: -4 }, { scale: 1.02 }], shadowOpacity: 0.22, shadowRadius: 20, shadowOffset: { width: 0, height: 13 }, elevation: 8 },
  pressed: { transform: [{ scale: 0.972 }, { translateY: 1 }], shadowOpacity: 0.05, elevation: 2 },
  title: { color: colors.textPrimary, fontWeight: '900', fontSize: 14, lineHeight: 18 },
  titleDark: { color: '#FFFFFF' },
  meta: { color: colors.textSecondary, fontWeight: '800', fontSize: 11 },
  metaDark: { color: '#F2DCE7' },
});
