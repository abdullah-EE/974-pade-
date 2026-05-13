import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '@/theme/tokens';

export function VerificationBadge({ label = 'Verified' }: { label?: string }) {
  return (
    <View style={styles.badge}>
      <MaterialCommunityIcons name="check-decagram" size={14} color={colors.primary} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', backgroundColor: colors.softMaroon, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5 },
  text: { color: colors.primary, fontSize: 12, fontWeight: '900' },
});
