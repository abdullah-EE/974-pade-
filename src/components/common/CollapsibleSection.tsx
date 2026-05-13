import { ReactNode, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme/tokens';

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
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          {action ? <Text style={styles.action}>{action}</Text> : null}
        </View>
        <MaterialCommunityIcons name={open ? 'chevron-up' : 'chevron-down'} size={22} color={colors.primary} />
      </Pressable>
      {open ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  header: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 2 },
  pressed: { transform: [{ scale: 0.99 }] },
  title: { color: colors.textPrimary, fontWeight: '900', fontSize: 19 },
  action: { color: colors.textSecondary, fontWeight: '800', marginTop: 3, fontSize: 12 },
  body: { gap: spacing.sm },
});
