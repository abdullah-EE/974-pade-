import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';

type Variant = 'primary' | 'secondary' | 'subtle' | 'danger';

export function PremiumButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  style?: StyleProp<ViewStyle>;
}) {
  const dark = variant === 'primary' || variant === 'danger';
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.base, styles[variant], style, pressed && styles.pressed]}>
      <View pointerEvents="none" style={[styles.highlight, !dark && styles.highlightLight]} />
      <View style={styles.inner}>
        {icon ? <MaterialCommunityIcons name={icon} size={17} color={dark ? '#FFFFFF' : colors.primary} /> : null}
        <Text style={[styles.text, !dark && styles.textAlt]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 46, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', shadowColor: '#2A1621', shadowOpacity: 0.18, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 5, borderBottomWidth: 3, borderBottomColor: 'rgba(0,0,0,0.16)' },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.primary, borderBottomColor: 'rgba(102,0,51,0.20)' },
  subtle: { backgroundColor: colors.softMaroon, borderBottomColor: 'rgba(102,0,51,0.12)' },
  danger: { backgroundColor: colors.danger },
  highlight: { position: 'absolute', left: 10, right: 10, top: 4, height: 12, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.16)' },
  highlightLight: { backgroundColor: 'rgba(102,0,51,0.06)' },
  inner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  text: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  textAlt: { color: colors.primary },
  pressed: { opacity: 0.94, transform: [{ scale: 0.965 }, { translateY: 2 }], shadowOpacity: 0.05, elevation: 1, borderBottomWidth: 1 },
});
