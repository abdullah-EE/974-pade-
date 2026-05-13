import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '@/theme/tokens';
import { AvailabilitySlot } from '@/types/models';

type SlotInput = AvailabilitySlot | string;

function normalizeSlot(slot: SlotInput, index: number): AvailabilitySlot {
  return typeof slot === 'string' ? { id: `slot-${index}-${slot}`, label: slot, status: 'available' } : slot;
}

export function TimeSlotChips({
  slots,
  limit = 3,
  selectedId,
  onSelect,
}: {
  slots: SlotInput[];
  limit?: number;
  selectedId?: string;
  onSelect?: (slot: AvailabilitySlot) => void;
}) {
  return (
    <View style={styles.row}>
      {slots.slice(0, limit).map((slot, index) => {
        const item = normalizeSlot(slot, index);
        const disabled = item.status === 'full';
        const selected = selectedId === item.id;
        return (
          <Pressable key={item.id} disabled={disabled} onPress={() => onSelect?.(item)} style={({ pressed }) => [styles.chip, selected && styles.chipSelected, disabled && styles.chipDisabled, pressed && !disabled && styles.pressed]}>
            <Text style={[styles.label, selected && styles.labelSelected, disabled && styles.labelDisabled]}>{item.label}</Text>
            {item.status !== 'available' ? <Text style={[styles.status, selected && styles.labelSelected, disabled && styles.labelDisabled]}>{item.status === 'few-left' ? 'Few left' : 'Fully booked'}</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { minHeight: 34, justifyContent: 'center', backgroundColor: colors.softMaroon, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill, borderWidth: 1, borderColor: 'transparent' },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipDisabled: { opacity: 0.44, backgroundColor: colors.border },
  label: { color: colors.primary, fontWeight: '900', fontSize: 12 },
  labelSelected: { color: '#FFFFFF' },
  labelDisabled: { color: colors.textSecondary },
  status: { color: colors.primary, fontSize: 10, fontWeight: '800', marginTop: 1 },
  pressed: { transform: [{ scale: 0.97 }] },
});
