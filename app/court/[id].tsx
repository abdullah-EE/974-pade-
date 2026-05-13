import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Linking from 'expo-linking';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ActionSheet } from '@/components/common/ActionSheet';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { MatchCard } from '@/components/common/MatchCard';
import { PlayerAvatar } from '@/components/common/PlayerAvatar';
import { PremiumButton } from '@/components/common/PremiumButton';
import { ScreenTransitionWrapper } from '@/components/common/ScreenTransitionWrapper';
import { SectionHeader } from '@/components/common/SectionHeader';
import { TimeSlotChips } from '@/components/common/TimeSlotChips';
import { useAppState } from '@/state/AppState';
import { colors, radius, spacing } from '@/theme/tokens';
import { centeredContent } from '@/theme/layout';
import { AvailabilitySlot, Player } from '@/types/models';

export default function CourtDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { courts, matches, players, createChallenge, currentUser } = useAppState();
  const court = courts.find((item) => item.id === id) || courts[0];
  const [sheet, setSheet] = useState<'booking' | 'challenge' | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(court.availabilitySlots.find((slot) => slot.status !== 'full') || null);
  const interested = court.interestedPlayerIds
    .map((playerId) => players.find((player) => player.id === playerId))
    .filter((player): player is Player => Boolean(player));
  const courtMatches = matches.filter((match) => match.courtId === court.id).slice(0, 4);
  const openExternalBooking = async () => {
    await Linking.openURL(court.bookingUrl);
    setSheet(null);
  };
  const openCourtLink = async (url?: string) => {
    if (!url) return;
    await Linking.openURL(url);
    setSheet(null);
  };

  return (
    <ScreenTransitionWrapper>
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <ImageWithFallback uri={court.image} style={styles.heroImage} label={court.name} />
        <LinearGradient colors={['rgba(26,16,21,0.05)', 'rgba(26,16,21,0.78)']} style={StyleSheet.absoluteFillObject} />
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.back, pressed && styles.backPressed]}>
          <MaterialCommunityIcons name="chevron-left" size={26} color="#FFFFFF" />
        </Pressable>
        <View style={styles.heroCopy}>
          <Text style={styles.title}>{court.name}</Text>
          <Text style={styles.subtitle}>{court.area} - {court.indoor ? 'Indoor' : 'Outdoor'} - {court.availabilityStatus}</Text>
        </View>
      </View>

      <Text style={styles.description}>{court.description}</Text>
      <TimeSlotChips slots={court.availabilitySlots} />

      <View style={styles.actions}>
        <PremiumButton label="Book externally" icon="open-in-new" onPress={() => setSheet('booking')} style={{ flex: 1 }} />
        <PremiumButton label="Submit Match Here" variant="secondary" icon="clipboard-check-outline" onPress={() => router.push({ pathname: '/(tabs)/submit', params: { courtId: court.id } })} style={{ flex: 1 }} />
      </View>
      <PremiumButton label="Challenge Players Here" variant="subtle" icon="sword-cross" onPress={() => setSheet('challenge')} />

      <View>
        <SectionHeader title="Amenities" />
        <View style={styles.amenities}>
          {court.amenities.map((item) => (
            <View key={item} style={styles.amenity}>
              <MaterialCommunityIcons name="check-circle-outline" size={17} color={colors.primary} />
              <Text style={styles.amenityText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      <View>
        <SectionHeader title="Players Here Tonight" />
        <View style={styles.players}>
          {interested.map((player) => (
            <Pressable key={player.id} onPress={() => router.push(`/player/${player.id}`)} style={({ pressed }) => [styles.playerPill, pressed && styles.pressedPill]}>
              <PlayerAvatar name={player.name} uri={player.avatar} size={34} />
              <Text numberOfLines={1} style={styles.playerName}>{player.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View>
        <SectionHeader title="Recent Ranked Matches" />
        <View style={styles.matchStack}>
          {courtMatches.map((match) => (
            <MatchCard key={match.id} match={match} court={court} players={players} />
          ))}
        </View>
      </View>

      <View>
        <SectionHeader title="Venue Map" />
        <View style={styles.map}>
          <MaterialCommunityIcons name="map-marker-radius-outline" size={34} color={colors.primary} />
          <Text style={styles.mapText}>{court.area}, Qatar</Text>
        </View>
      </View>

      <ActionSheet visible={sheet === 'booking'} title="External booking" subtitle={`${court.externalBooking} opens outside 974 Padel.`} onClose={() => setSheet(null)}>
        <Text style={styles.sheetText}>{court.priceRange}. Select a non-full slot, then continue externally with the venue.</Text>
        <TimeSlotChips slots={court.availabilitySlots} selectedId={selectedSlot?.id} onSelect={setSelectedSlot} />
        <PremiumButton label={selectedSlot ? `Open external booking for ${selectedSlot.label}` : 'Open external booking'} icon="open-in-new" onPress={openExternalBooking} />
        <View style={styles.sheetActions}>
          <PremiumButton label="Instagram" variant="secondary" icon="instagram" onPress={() => openCourtLink(court.instagramUrl)} style={{ flex: 1 }} />
          <PremiumButton label="Maps" variant="subtle" icon="map-marker-radius-outline" onPress={() => openCourtLink(court.mapsUrl)} style={{ flex: 1 }} />
        </View>
      </ActionSheet>

      <ActionSheet visible={sheet === 'challenge'} title="Challenge players" subtitle="Choose one of the players already interested in this court tonight." onClose={() => setSheet(null)}>
        {interested.filter((player) => player.id !== currentUser.id).slice(0, 3).map((player) => (
          <Pressable
            key={player.id}
            onPress={() => {
              createChallenge({
                opponentId: player.id,
                courtId: court.id,
                startsAt: '2026-05-12T20:30:00+03:00',
                level: player.level,
                note: `Ranked challenge at ${court.name}.`,
                privacy: 'Private invite',
              });
              setSheet(null);
            }}
            style={({ pressed }) => [styles.sheetRow, pressed && styles.sheetRowPressed]}
          >
            <PlayerAvatar name={player.name} uri={player.avatar} size={42} />
            <View style={{ flex: 1 }}>
              <Text style={styles.sheetName}>{player.name}</Text>
              <Text style={styles.sheetText}>{player.level} - rating {player.rating}</Text>
            </View>
            <MaterialCommunityIcons name="send-outline" size={20} color={colors.primary} />
          </Pressable>
        ))}
      </ActionSheet>
    </ScrollView>
    </ScreenTransitionWrapper>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { ...centeredContent, paddingBottom: 40, gap: 22 },
  hero: { height: 338, overflow: 'hidden', backgroundColor: colors.deep },
  heroImage: { width: '100%', height: '100%' },
  back: { position: 'absolute', top: 52, left: 14, width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  backPressed: { transform: [{ scale: 0.92 }] },
  heroCopy: { position: 'absolute', left: 18, right: 18, bottom: 24 },
  title: { color: '#FFFFFF', fontSize: 32, lineHeight: 38, fontWeight: '900' },
  subtitle: { color: '#F7EEF2', marginTop: 8, fontWeight: '800' },
  description: { marginHorizontal: spacing.md, color: colors.textSecondary, fontWeight: '700', lineHeight: 21 },
  actions: { flexDirection: 'row', gap: 10, marginHorizontal: spacing.md },
  amenities: { marginHorizontal: spacing.md, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  amenity: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.glass, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 11, paddingVertical: 8 },
  amenityText: { color: colors.textPrimary, fontWeight: '800' },
  players: { marginHorizontal: spacing.md, gap: 9 },
  playerPill: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: colors.glass, borderRadius: radius.pill, padding: 8, borderWidth: 1, borderColor: colors.border },
  pressedPill: { transform: [{ scale: 0.98 }, { translateY: 1 }], backgroundColor: colors.softMaroon },
  playerName: { flex: 1, color: colors.textPrimary, fontWeight: '900' },
  matchStack: { marginHorizontal: spacing.md, gap: 10 },
  map: { marginHorizontal: spacing.md, height: 138, borderRadius: radius.lg, backgroundColor: colors.softMaroon, alignItems: 'center', justifyContent: 'center' },
  mapText: { marginTop: 8, color: colors.pearl, fontWeight: '900' },
  sheetText: { color: colors.textSecondary, fontWeight: '700', lineHeight: 20 },
  sheetActions: { flexDirection: 'row', gap: 8 },
  sheetRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  sheetRowPressed: { transform: [{ scale: 0.98 }], backgroundColor: colors.softMaroon },
  sheetName: { color: colors.textPrimary, fontWeight: '900' },
});
