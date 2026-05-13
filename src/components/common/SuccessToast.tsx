import { StyleSheet, Text, View } from 'react-native';
import { MotiView } from 'moti';
import { colors, radius } from '@/theme/tokens';

export function SuccessToast({ visible, message }: { visible: boolean; message: string }) {
  if (!visible) return null;
  return (
    <MotiView from={{ opacity: 0, translateY: 10, scale: 0.96 }} animate={{ opacity: 1, translateY: 0, scale: 1 }} transition={{ type: 'timing', duration: 220 }} style={styles.wrap}>
      <View style={styles.dot} />
      <Text style={styles.text}>{message}</Text>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.darkSection, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 10 },
  dot: { width: 9, height: 9, borderRadius: 999, backgroundColor: colors.success },
  text: { color: '#FFFFFF', fontWeight: '900' },
});
