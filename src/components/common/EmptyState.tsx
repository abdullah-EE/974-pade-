import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '@/theme/tokens';

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.wrap}>
      <MaterialCommunityIcons name="stadium" size={24} color={colors.hotPink} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', padding: 18, backgroundColor: colors.glass, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border },
  title: { marginTop: 8, color: colors.textPrimary, fontWeight: '900', fontSize: 16 },
  body: { marginTop: 4, color: colors.textSecondary, fontWeight: '700', textAlign: 'center', lineHeight: 19 },
});
