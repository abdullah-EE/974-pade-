import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Coach } from '@/types/Coach';
import { colors, radius, shadow } from '@/theme/tokens';
import { ImageWithFallback } from './ImageWithFallback';
import { PremiumButton } from './PremiumButton';

export function CoachCard({ coach, onOpen, onRequest }: { coach: Coach; onOpen: () => void; onRequest: () => void }) {
  return (
    <Pressable onPress={onOpen} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <ImageWithFallback uri={coach.heroImageUrl} style={styles.image} label={coach.name} />
      <View style={styles.body}>
        <Text numberOfLines={1} style={styles.name}>{coach.name}</Text>
        <Text style={styles.meta}>{coach.specialty}</Text>
        <Text style={styles.meta}>{coach.area} - {coach.priceLabel}</Text>
        <View style={styles.row}>
          <Text style={styles.rating}>{coach.rating.toFixed(1)}</Text>
          <PremiumButton label={coach.requested ? 'Requested' : 'Request'} icon={coach.requested ? 'check' : 'calendar-plus'} variant={coach.requested ? 'subtle' : 'primary'} onPress={onRequest} style={{ flex: 1 }} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: 238, overflow: 'hidden', backgroundColor: '#FFFFFF', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, ...shadow },
  pressed: { transform: [{ scale: 0.982 }, { translateY: 1 }], shadowOpacity: 0.04 },
  image: { width: '100%', height: 132 },
  body: { padding: 12, gap: 7 },
  name: { color: colors.textPrimary, fontWeight: '900', fontSize: 17 },
  meta: { color: colors.textSecondary, fontWeight: '800', fontSize: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rating: { overflow: 'hidden', color: colors.primary, backgroundColor: colors.softMaroon, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 6, fontWeight: '900' },
});
