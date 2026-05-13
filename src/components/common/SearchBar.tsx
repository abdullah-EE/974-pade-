import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';

export function SearchBar({ value, onChangeText, placeholder = 'Search courts or areas' }: { value: string; onChangeText: (value: string) => void; placeholder?: string }) {
  return (
    <View style={styles.wrap}>
      <MaterialCommunityIcons name="magnify" color={colors.textSecondary} size={20} />
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.textSecondary} style={styles.input} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { minHeight: 50, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.md },
  input: { flex: 1, color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
});
