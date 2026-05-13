import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActionSheet } from '@/components/common/ActionSheet';
import { CoachCard } from '@/components/common/CoachCard';
import { CollapsibleSection } from '@/components/common/CollapsibleSection';
import { CourtCard } from '@/components/common/CourtCard';
import { EmptyState } from '@/components/common/EmptyState';
import { FilterChips } from '@/components/common/FilterChips';
import { FloatingActionCard } from '@/components/common/FloatingActionCard';
import { HeroCarousel } from '@/components/common/HeroCarousel';
import { HorizontalCardRail } from '@/components/common/HorizontalCardRail';
import { OpenGameCard } from '@/components/common/OpenGameCard';
import { PremiumButton } from '@/components/common/PremiumButton';
import { SearchBar } from '@/components/common/SearchBar';
import { ScreenTransitionWrapper } from '@/components/common/ScreenTransitionWrapper';
import { TimeSlotChips } from '@/components/common/TimeSlotChips';
import { VideoCard } from '@/components/common/VideoCard';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useAppState } from '@/state/AppState';
import { colors, radius, spacing } from '@/theme/tokens';
import { centeredContent } from '@/theme/layout';
import { AvailabilitySlot, Court } from '@/types/models';
import { Coach } from '@/types/Coach';
import { VideoPost } from '@/types/VideoPost';
import { winRate } from '@/utils/format';

const filters = ['All', 'Tonight', 'Indoor', 'Outdoor', 'Lusail', 'Katara', 'Msheireb', 'Education City', 'Aspire'];
const searchModes = ['Courts', 'Players', 'Coaches', 'Videos'] as const;

export default function PlayScreen() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query);
  const [filter, setFilter] = useState('All');
  const [mode, setMode] = useState<(typeof searchModes)[number]>('Courts');
  const [sheetCourt, setSheetCourt] = useState<Court | null>(null);
  const [sheetCoach, setSheetCoach] = useState<Coach | null>(null);
  const [sheetVideo, setSheetVideo] = useState<VideoPost | null>(null);
  const [selectedCoachSlot, setSelectedCoachSlot] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const { courts, openGames, players, coaches, videos, currentUser, friendIds, addFriend, removeFriend, joinOpenGame, requestCoachSession, toggleVideoLike, toggleVideoSave } = useAppState();

  const filteredCourts = useMemo(() => {
    return courts.filter((court) => {
      const text = `${court.name} ${court.area}`.toLowerCase();
      const queryMatch = text.includes(debouncedQuery.trim().toLowerCase());
      const filterMatch =
        filter === 'All' ||
        filter === 'Tonight' ||
        (filter === 'Indoor' && court.indoor) ||
        (filter === 'Outdoor' && !court.indoor) ||
        court.area === filter;
      return queryMatch && filterMatch;
    });
  }, [debouncedQuery, filter]);
  const filteredPlayers = useMemo(() => {
    const value = debouncedQuery.trim().toLowerCase();
    return players
      .filter((player) => player.id !== currentUser.id)
      .filter((player) => !value || `${player.name} ${player.username} ${player.club} ${player.level}`.toLowerCase().includes(value))
      .slice(0, 8);
  }, [currentUser.id, debouncedQuery, players]);
  const filteredCoaches = useMemo(() => {
    const value = debouncedQuery.trim().toLowerCase();
    return coaches.filter((coach) => !value || `${coach.name} ${coach.specialty} ${coach.area}`.toLowerCase().includes(value));
  }, [coaches, debouncedQuery]);
  const filteredVideos = useMemo(() => {
    const value = debouncedQuery.trim().toLowerCase();
    return videos.filter((video) => !value || `${video.title} ${video.creatorName} ${video.tag}`.toLowerCase().includes(value));
  }, [debouncedQuery, videos]);

  const openCourt = (id: string) => router.push(`/court/${id}`);
  const startRanked = (courtId: string) => router.push({ pathname: '/(tabs)/submit', params: { courtId } });
  const openBookingSheet = (court: Court) => {
    setSheetCourt(court);
    setSelectedSlot(court.availabilitySlots.find((slot) => slot.status !== 'full') || null);
  };
  const openExternalBooking = async () => {
    if (!sheetCourt) return;
    await Linking.openURL(sheetCourt.bookingUrl);
    setSheetCourt(null);
  };
  const openCourtLink = async (url?: string) => {
    if (!url) return;
    await Linking.openURL(url);
    setSheetCourt(null);
  };

  return (
    <ScreenTransitionWrapper>
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <HeroCarousel courts={courts} />
      <CollapsibleSection title="Quick Actions" action="Challenge, players, coaches, clips" defaultOpen>
        <View style={styles.quickGrid}>
          <FloatingActionCard dark title="Create Challenge" meta="Private or public" icon="sword-cross" onPress={() => router.push('/(tabs)/challenges')} />
          <FloatingActionCard title="Find Players" meta="Search rivals" icon="account-search-outline" onPress={() => setMode('Players')} />
        </View>
        <View style={styles.quickGrid}>
          <FloatingActionCard title="Submit Match" meta="Proof + confirm" icon="clipboard-check-outline" onPress={() => router.push('/(tabs)/submit')} />
          <FloatingActionCard title="Find Coach" meta="Book locally" icon="whistle-outline" onPress={() => setMode('Coaches')} />
        </View>
      </CollapsibleSection>
      <View style={styles.modeRow}>
        {searchModes.map((item) => (
          <Pressable key={item} onPress={() => setMode(item)} style={({ pressed }) => [styles.modeChip, mode === item && styles.modeActive, pressed && styles.chipPressed]}>
            <Text style={[styles.modeText, mode === item && styles.modeTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <SearchBar value={query} onChangeText={setQuery} placeholder={mode === 'Courts' ? 'Search courts or areas' : mode === 'Players' ? 'Search players, usernames, areas' : mode === 'Coaches' ? 'Search coaches or specialties' : 'Search clips, creators, tags'} />
      {mode === 'Courts' ? <FilterChips items={filters} active={filter} onChange={setFilter} /> : null}

      <View style={styles.networkPanel}>
        <View style={{ flex: 1 }}>
          <Text style={styles.panelKicker}>Your Qatar ladder</Text>
          <Text style={styles.panelTitle}>#{currentUser.rank} - {currentUser.rating} rating</Text>
          <Text style={styles.panelCopy}>{currentUser.streak} match streak - {winRate(currentUser.wins, currentUser.losses)}% win rate - {friendIds.length} friends ready</Text>
        </View>
        <View style={styles.wallet}>
          <Text style={styles.walletValue}>{friendIds.length}</Text>
          <Text style={styles.walletLabel}>friends</Text>
        </View>
      </View>

      <CollapsibleSection title="Courts Available Tonight" action={`${filteredCourts.length} courts`} defaultOpen>
        {filteredCourts.length ? (
          <HorizontalCardRail>
            {filteredCourts.slice(0, 6).map((court) => (
              <CourtCard key={court.id} court={court} onOpen={() => openCourt(court.id)} onBook={() => openBookingSheet(court)} onStartRanked={() => startRanked(court.id)} />
            ))}
          </HorizontalCardRail>
        ) : (
          <EmptyState title="No courts found" body="Try another area or clear the search." />
        )}
      </CollapsibleSection>

      <CollapsibleSection title="Players Ready Tonight" action={`${filteredPlayers.length} found`} defaultOpen={mode === 'Players'}>
        <HorizontalCardRail>
          {filteredPlayers.map((player) => {
            const isFriend = friendIds.includes(player.id);
            return (
              <Pressable key={player.id} onPress={() => router.push(`/player/${player.id}`)} style={({ pressed }) => [styles.playerCard, pressed && styles.quickPressed]}>
                <View style={styles.playerAvatar}>
                  <Text style={styles.playerInitials}>{player.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</Text>
                </View>
                <Text numberOfLines={1} style={styles.playerName}>{player.name}</Text>
                <Text numberOfLines={1} style={styles.playerMeta}>{player.level} - {player.status === 'playingTonight' ? 'playing tonight' : player.status}</Text>
                <View style={styles.playerActions}>
                  <PremiumButton label={isFriend ? 'Friend' : 'Add'} icon={isFriend ? 'account-check' : 'account-plus-outline'} variant={isFriend ? 'subtle' : 'secondary'} onPress={() => (isFriend ? removeFriend(player.id) : addFriend(player.id))} style={{ flex: 1 }} />
                  <PremiumButton label="Challenge" icon="sword-cross" onPress={() => router.push(`/player/${player.id}`)} style={{ flex: 1 }} />
                </View>
              </Pressable>
            );
          })}
        </HorizontalCardRail>
      </CollapsibleSection>

      <CollapsibleSection title="Open Games Near You" action={`${openGames.length} open`}>
        <View style={styles.darkBand}>
        <Text style={styles.darkKicker}>Open match energy</Text>
        <Text style={styles.darkTitle}>Open Games Near You</Text>
        <HorizontalCardRail>
          {openGames.map((game) => {
            const court = courts.find((item) => item.id === game.courtId) || courts[0];
            return (
              <OpenGameCard
                key={game.id}
                game={game}
                court={court}
                players={players}
                onJoin={() => joinOpenGame(game.id)}
              />
            );
          })}
        </HorizontalCardRail>
        </View>
      </CollapsibleSection>

      <CollapsibleSection title="Coaching Picks" action={`${filteredCoaches.length} coaches`} defaultOpen={mode === 'Coaches'}>
        <HorizontalCardRail>
          {filteredCoaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} onOpen={() => { setSelectedCoachSlot(coach.availableSlots[0] || 'Next available'); setSheetCoach(coach); }} onRequest={() => requestCoachSession(coach.id, coach.availableSlots[0] || 'Next available')} />
          ))}
        </HorizontalCardRail>
      </CollapsibleSection>

      <CollapsibleSection title="Video Highlights" action={`${filteredVideos.length} clips`} defaultOpen={mode === 'Videos'}>
        <HorizontalCardRail>
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} onOpen={() => setSheetVideo(video)} />
          ))}
        </HorizontalCardRail>
      </CollapsibleSection>

      <CollapsibleSection title="Top Courts This Week">
        <View style={styles.stack}>
          {courts.slice(0, 5).map((court) => (
            <CourtCard key={court.id} compact court={court} onOpen={() => openCourt(court.id)} onBook={() => openBookingSheet(court)} onStartRanked={() => startRanked(court.id)} />
          ))}
        </View>
      </CollapsibleSection>

      <ActionSheet visible={!!sheetCourt} title="Book externally" subtitle={sheetCourt ? `${sheetCourt.name} accepts bookings through ${sheetCourt.externalBooking}.` : undefined} onClose={() => setSheetCourt(null)}>
        {sheetCourt ? (
          <>
            <Text style={styles.sheetText}>{sheetCourt.priceRange}. Booking is completed externally with the venue.</Text>
            <TimeSlotChips slots={sheetCourt.availabilitySlots} selectedId={selectedSlot?.id} onSelect={setSelectedSlot} />
            <PremiumButton label={selectedSlot ? `Open venue for ${selectedSlot.label}` : 'Open venue booking'} icon="open-in-new" onPress={openExternalBooking} />
            <View style={styles.sheetActions}>
              <PremiumButton label="Instagram" variant="secondary" icon="instagram" onPress={() => openCourtLink(sheetCourt.instagramUrl)} style={{ flex: 1 }} />
              <PremiumButton label="Maps" variant="subtle" icon="map-marker-radius-outline" onPress={() => openCourtLink(sheetCourt.mapsUrl)} style={{ flex: 1 }} />
            </View>
            <PremiumButton label="Start ranked match instead" variant="secondary" icon="trophy-outline" onPress={() => startRanked(sheetCourt.id)} />
          </>
        ) : null}
      </ActionSheet>

      <ActionSheet visible={!!sheetCoach} title={sheetCoach?.name || 'Coach'} subtitle={sheetCoach ? `${sheetCoach.specialty} - ${sheetCoach.priceLabel}` : undefined} onClose={() => setSheetCoach(null)}>
        {sheetCoach ? (
          <>
            <Text style={styles.sheetText}>{sheetCoach.bio}</Text>
            <View style={styles.selector}>
              {sheetCoach.availableSlots.map((slot) => (
                <Pressable key={slot} onPress={() => setSelectedCoachSlot(slot)} style={({ pressed }) => [styles.slotChoice, selectedCoachSlot === slot && styles.slotActive, pressed && styles.chipPressed]}>
                  <Text style={[styles.slotText, selectedCoachSlot === slot && styles.slotTextActive]}>{slot}</Text>
                </Pressable>
              ))}
            </View>
            <PremiumButton label={sheetCoach.requested ? 'Session requested' : 'Request session'} icon="calendar-check" onPress={() => { requestCoachSession(sheetCoach.id, selectedCoachSlot); setSheetCoach(null); }} />
          </>
        ) : null}
      </ActionSheet>

      <ActionSheet visible={!!sheetVideo} title={sheetVideo?.title || 'Video'} subtitle={sheetVideo ? `${sheetVideo.creatorName} - ${sheetVideo.duration}` : undefined} onClose={() => setSheetVideo(null)}>
        {sheetVideo ? (
          <>
            <Text style={styles.sheetText}>{sheetVideo.description}</Text>
            <View style={styles.sheetActions}>
              <PremiumButton label={sheetVideo.liked ? 'Liked' : 'Like'} icon="heart-outline" onPress={() => toggleVideoLike(sheetVideo.id)} style={{ flex: 1 }} />
              <PremiumButton label={sheetVideo.saved ? 'Saved' : 'Save'} variant="secondary" icon="bookmark-outline" onPress={() => toggleVideoSave(sheetVideo.id)} style={{ flex: 1 }} />
            </View>
            <PremiumButton label="Comment preview" variant="subtle" icon="comment-outline" onPress={() => setSheetVideo(null)} />
          </>
        ) : null}
      </ActionSheet>
    </ScrollView>
    </ScreenTransitionWrapper>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { ...centeredContent, padding: spacing.md, gap: 24, paddingBottom: 104 },
  horizontal: { gap: 12, paddingRight: spacing.md },
  stack: { gap: 14 },
  quickGrid: { flexDirection: 'row', gap: 10 },
  quickPressed: { transform: [{ scale: 0.975 }, { translateY: 1 }], shadowOpacity: 0.05 },
  modeRow: { flexDirection: 'row', padding: 4, borderRadius: radius.pill, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.border },
  modeChip: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: radius.pill },
  modeActive: { backgroundColor: colors.primary, shadowColor: colors.hotPink, shadowOpacity: 0.26, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  chipPressed: { transform: [{ scale: 0.96 }, { translateY: 1 }] },
  modeText: { color: colors.textSecondary, fontWeight: '900' },
  modeTextActive: { color: '#FFFFFF' },
  playerCard: { width: 210, backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.border, gap: 9, shadowColor: '#000000', shadowOpacity: 0.18, shadowRadius: 14, shadowOffset: { width: 0, height: 9 }, elevation: 4 },
  playerAvatar: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.softMaroon, borderWidth: 1, borderColor: colors.border },
  playerInitials: { color: colors.pearl, fontWeight: '900' },
  playerName: { color: colors.textPrimary, fontWeight: '900', fontSize: 16 },
  playerMeta: { color: colors.textSecondary, fontWeight: '800', fontSize: 12 },
  playerActions: { flexDirection: 'row', gap: 8 },
  sheetText: { color: colors.textSecondary, fontWeight: '700', lineHeight: 20 },
  sheetActions: { flexDirection: 'row', gap: 8 },
  selector: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slotChoice: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.glass },
  slotActive: { backgroundColor: colors.primary, borderColor: colors.hotPink },
  slotText: { color: colors.textSecondary, fontWeight: '900' },
  slotTextActive: { color: '#FFFFFF' },
  darkBand: { marginHorizontal: -spacing.md, paddingVertical: 20, paddingLeft: spacing.md, backgroundColor: colors.darkSection, gap: 12 },
  darkKicker: { color: '#F2DCE7', fontWeight: '900', fontSize: 12, textTransform: 'uppercase' },
  darkTitle: { color: '#FFFFFF', fontSize: 23, fontWeight: '900' },
  networkPanel: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: radius.xl, backgroundColor: colors.darkSection, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  panelKicker: { color: '#E7CAD7', fontWeight: '900', fontSize: 12, textTransform: 'uppercase' },
  panelTitle: { color: '#FFFFFF', fontWeight: '900', fontSize: 24, marginTop: 5 },
  panelCopy: { color: '#F7EEF2', fontWeight: '700', lineHeight: 19, marginTop: 5 },
  wallet: { width: 82, height: 82, borderRadius: 41, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.court, borderWidth: 4, borderColor: 'rgba(255,255,255,0.16)' },
  walletValue: { color: '#FFFFFF', fontWeight: '900', fontSize: 19 },
  walletLabel: { color: '#DCEFE8', fontWeight: '900', fontSize: 11, marginTop: 1 },
});
