import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Court } from '@/types/models';
import { colors, radius, shadow } from '@/theme/tokens';
import { ImageWithFallback } from './ImageWithFallback';
import { PremiumButton } from './PremiumButton';
import { TimeSlotChips } from './TimeSlotChips';

export function CourtCard({ court, onOpen, onBook, onStartRanked, compact = false }: { court: Court; onOpen: () => void; onBook: () => void; onStartRanked: () => void; compact?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Pressable onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)} onPress={onOpen} style={({ pressed }) => [styles.card, compact && styles.compact, hovered && !pressed && styles.hovered, pressed && styles.pressed]}>
      <View style={styles.media}>
        <ImageWithFallback uri={court.image} style={styles.image} label={court.name} />
        <View style={styles.photoShade} />
      </View>
      <View style={styles.body}>
        <View style={styles.top}>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={styles.name}>{court.name}</Text>
            <Text style={styles.area}>{court.area}</Text>
          </View>
          <View style={styles.badges}>
            <View style={styles.badge}>
              <MaterialCommunityIcons name={court.indoor ? 'home-roof' : 'weather-night'} size={14} color={colors.primary} />
              <Text style={styles.badgeText}>{court.indoor ? 'Indoor' : 'Outdoor'}</Text>
            </View>
            <Text style={styles.status}>{court.availabilityStatus}</Text>
          </View>
        </View>
        <TimeSlotChips slots={court.availabilitySlots} />
        <View style={styles.actions}>
          <PremiumButton label="Book externally" icon="open-in-new" onPress={onBook} style={{ flex: 1 }} />
          <PremiumButton label="Start ranked" variant="secondary" icon="trophy-outline" onPress={onStartRanked} style={{ flex: 1 }} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: 318, backgroundColor: '#FFFFFF', borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, ...shadow, cursor: 'pointer' } as any,
  compact: { width: 292 },
  hovered: { transform: [{ translateY: -5 }, { scale: 1.018 }], shadowOpacity: 0.17, shadowRadius: 24, shadowOffset: { width: 0, height: 14 }, elevation: 9 },
  pressed: { transform: [{ scale: 0.985 }, { translateY: 1 }], shadowOpacity: 0.04 },
  media: { height: 184, width: '100%', overflow: 'hidden', backgroundColor: colors.deep },
  image: { height: '100%', width: '100%' },
  photoShade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 72, backgroundColor: 'rgba(26,16,21,0.22)' },
  body: { padding: 12, gap: 10 },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  name: { color: colors.textPrimary, fontWeight: '900', fontSize: 17 },
  area: { color: colors.textSecondary, marginTop: 3, fontWeight: '700' },
  badges: { alignItems: 'flex-end', gap: 6 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.softMaroon, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 5 },
  badgeText: { color: colors.primary, fontWeight: '900', fontSize: 11 },
  status: { color: colors.textSecondary, fontWeight: '900', fontSize: 11 },
  actions: { flexDirection: 'row', gap: 8 },
});
