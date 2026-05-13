import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/tokens';

export function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <View style={styles.row}>
      <Text numberOfLines={1} style={styles.title}>{title}</Text>
      {action ? <Text numberOfLines={1} style={styles.action}>{action}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 12 },
  title: { flex: 1, minWidth: 0, color: colors.textPrimary, fontSize: 20, fontWeight: '900' },
  action: { maxWidth: 150, color: colors.hotPink, fontWeight: '800' },
});
