import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { MotiView } from 'moti';
import { colors, shadow, spacing } from '@/theme/tokens';
import { centeredContent } from '@/theme/layout';

export function ActionSheet({ visible, title, subtitle, children, onClose }: { visible: boolean; title: string; subtitle?: string; children: ReactNode; onClose: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <MotiView from={{ opacity: 0, translateY: 28, scale: 0.98 }} animate={{ opacity: 1, translateY: 0, scale: 1 }} transition={{ type: 'timing', duration: 220 }} style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.head}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{title}</Text>
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
            <Pressable onPress={onClose} style={({ pressed }) => [styles.close, pressed && styles.closePressed]}>
              <MaterialCommunityIcons name="close" size={20} color={colors.textPrimary} />
            </Pressable>
          </View>
          {children}
        </MotiView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(26,16,21,0.42)' },
  sheet: { ...centeredContent, backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.lg, gap: 14, ...shadow },
  handle: { width: 44, height: 5, borderRadius: 999, backgroundColor: colors.border, alignSelf: 'center' },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  title: { fontSize: 21, fontWeight: '900', color: colors.textPrimary },
  subtitle: { marginTop: 4, color: colors.textSecondary, lineHeight: 19 },
  close: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.glass, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  closePressed: { transform: [{ scale: 0.92 }] },
});
