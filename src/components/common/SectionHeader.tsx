import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/tokens';

export function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {action ? <Text style={styles.action}>{action}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: '900' },
  action: { color: colors.primary, fontWeight: '800' },
});
