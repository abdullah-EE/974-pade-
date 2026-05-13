import { ReactNode, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AnimatePresence, MotiView } from 'moti';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';

export function CollapsibleSection({
  title,
  action,
  defaultOpen = false,
  children,
}: {
  title: string;
  action?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View style={styles.wrap}>
      <Pressable onPress={() => setOpen((value) => !value)} style={({ pressed }) => [styles.header, pressed && styles.pressed]}>
        <View style={styles.titleWrap}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>{title}</Text>
          {action ? <Text numberOfLines={1} ellipsizeMode="tail" style={styles.action}>{action}</Text> : null}
        </View>
        <MaterialCommunityIcons name={open ? 'chevron-up' : 'chevron-down'} size={22} color={colors.primary} />
      </Pressable>
      <AnimatePresence>
        {open ? (
          <MotiView from={{ opacity: 0, translateY: -8, scale: 0.985 }} animate={{ opacity: 1, translateY: 0, scale: 1 }} exit={{ opacity: 0, translateY: -8, scale: 0.985 }} transition={{ type: 'timing', duration: 220 }} style={styles.body}>
            {children}
          </MotiView>
        ) : null}
      </AnimatePresence>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  header: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6, paddingHorizontal: 4, borderRadius: radius.lg },
  pressed: { transform: [{ scale: 0.99 }] },
  titleWrap: { flex: 1, minWidth: 0 },
  title: { color: colors.textPrimary, fontWeight: '900', fontSize: 19 },
  action: { color: colors.textSecondary, fontWeight: '800', marginTop: 3, fontSize: 12 },
  body: { gap: spacing.sm },
});
