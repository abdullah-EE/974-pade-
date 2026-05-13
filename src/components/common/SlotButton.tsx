import { Pressable, StyleSheet, Text } from 'react-native';
import { AvailabilitySlot } from '@/types/models';
import { colors, radius } from '@/theme/tokens';

export function SlotButton({ slot, selected, onSelect }: { slot: AvailabilitySlot; selected?: boolean; onSelect: (slot: AvailabilitySlot) => void }) {
  const disabled = slot.status === 'full';
  return (
    <Pressable disabled={disabled} onPress={() => onSelect(slot)} style={({ pressed }) => [styles.slot, selected && styles.selected, disabled && styles.disabled, pressed && !disabled && styles.pressed]}>
      <Text style={[styles.time, selected && styles.selectedText, disabled && styles.disabledText]}>{slot.label}</Text>
      <Text style={[styles.status, selected && styles.selectedText, disabled && styles.disabledText]}>{disabled ? 'Fully booked' : slot.status === 'few-left' ? 'Few left' : 'Available'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: { minWidth: 112, paddingHorizontal: 13, paddingVertical: 10, borderRadius: radius.md, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.border },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary, transform: [{ translateY: -1 }] },
  disabled: { opacity: 0.44, backgroundColor: colors.border },
  pressed: { transform: [{ scale: 0.96 }, { translateY: 1 }] },
  time: { color: colors.textPrimary, fontWeight: '900' },
  status: { color: colors.textSecondary, fontWeight: '800', fontSize: 11, marginTop: 3 },
  selectedText: { color: '#FFFFFF' },
  disabledText: { color: colors.textSecondary },
});
