import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ActionSheet } from '@/components/common/ActionSheet';
import { PremiumButton } from '@/components/common/PremiumButton';
import { ScreenTransitionWrapper } from '@/components/common/ScreenTransitionWrapper';
import { useAppState } from '@/state/AppState';
import { colors, radius, spacing } from '@/theme/tokens';
import { centeredContent } from '@/theme/layout';
import { Match, TournamentEvent } from '@/types/models';
import { isValidScore } from '@/utils/validation';

const levelFilters = ['Beginner', 'Intermediate', 'Advanced'] as const;

export default function TournamentsScreen() {
  const { tournaments, courts, players, currentUser, registerTournamentInterest, submitTournamentMatch } = useAppState();
  const [activeEvent, setActiveEvent] = useState<TournamentEvent | null>(null);
  const [scoreSheet, setScoreSheet] = useState<TournamentEvent | null>(null);
  const [levelFilter, setLevelFilter] = useState<(typeof levelFilters)[number]>('Intermediate');
  const [score, setScore] = useState('6-4, 6-3');
  const [message, setMessage] = useState('');
  const eventCourts = useMemo(() => new Map(courts.map((court) => [court.id, court])), [courts]);
  const visibleTournaments = useMemo(() => tournaments.filter((event) => event.level === levelFilter), [levelFilter, tournaments]);

  const submitResult = () => {
    if (!scoreSheet) return;
    if (!isValidScore(score)) {
      setMessage('Use a score like 6-4, 6-3.');
      return;
    }
    const match: Match = {
      id: `tournament-${Date.now()}`,
      teamA: [currentUser.id, 'p2'],
      teamB: ['p4', 'p5'],
      winner: 'A',
      score,
      courtId: scoreSheet.courtId,
      startsAt: scoreSheet.startsAt,
      ratingChange: 0,
      status: 'Pending',
    };
    submitTournamentMatch(scoreSheet.id, match);
    setMessage('Tournament result is pending club verification.');
    setScoreSheet(null);
  };

  return (
    <ScreenTransitionWrapper>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Official ranking path</Text>
          <Text style={styles.title}>Tournaments</Text>
          <Text style={styles.copy}>Only verified tournaments and approved club events affect official ranking. Friendly matches stay in networking and profile stats.</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.infoTitle}>Ranking-source rule</Text>
          <Text style={styles.infoCopy}>A result changes rating only after the event or club verifies it. Tournament result submission lives inside each event flow.</Text>
        </View>

        <View style={styles.segment}>
          {levelFilters.map((level) => (
            <Pressable key={level} onPress={() => setLevelFilter(level)} style={({ pressed }) => [styles.segmentItem, levelFilter === level && styles.segmentActive, pressed && styles.pressed]}>
              <Text style={[styles.segmentText, levelFilter === level && styles.segmentTextActive]}>{level}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.stack}>
          {visibleTournaments.map((event) => {
            const court = eventCourts.get(event.courtId);
            const isOpen = event.status === 'Open' || event.status === 'Filling fast';
            return (
              <Pressable key={event.id} onPress={() => setActiveEvent(event)} style={({ pressed }) => [styles.eventCard, pressed && styles.pressed]}>
                <View style={styles.eventTop}>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.cardKicker}>{event.timeLabel} - {event.status}</Text>
                    <Text style={styles.cardTitle}>{event.title}</Text>
                    <Text style={styles.cardMeta}>{event.clubName} - {court?.area || 'Qatar'} - {event.level}</Text>
                  </View>
                  <Text style={styles.badge}>{event.rankingSource === 'tournament' ? 'Tournament' : 'Club approved'}</Text>
                </View>
                <Text style={styles.cardCopy}>{event.description}</Text>
                <Text style={styles.cardMeta}>Format: {event.format} - Fee: {event.entryFeeLabel} - Status: {event.status}</Text>
                <View style={styles.actions}>
                  <PremiumButton label={event.registered ? 'Interest registered' : isOpen ? 'Register interest' : 'Notify me'} icon={isOpen ? 'check-decagram-outline' : 'bell-outline'} onPress={() => registerTournamentInterest(event.id)} style={{ flex: 1 }} />
                  <PremiumButton label="Submit event result" icon="clipboard-check-outline" variant="secondary" onPress={() => { setScoreSheet(event); setMessage(''); }} style={{ flex: 1 }} />
                </View>
              </Pressable>
            );
          })}
        </View>

        {message ? <Text style={styles.message}>{message}</Text> : null}

        <View style={styles.rankPanel}>
          <Text style={styles.kicker}>Official ranking</Text>
          <Text style={styles.rankTitle}>Verified leaderboard</Text>
          <Text style={styles.copy}>Ranking points come only from verified tournaments and approved club events.</Text>
          <View style={styles.stack}>
            {players.slice(0, 8).map((player) => (
              <Pressable key={player.id} style={({ pressed }) => [styles.rankRow, pressed && styles.pressed]}>
                <Text style={styles.rankNumber}>#{player.rank}</Text>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text numberOfLines={1} style={styles.rankName}>{player.name}</Text>
                  <Text numberOfLines={1} style={styles.rankMeta}>{player.club} - {player.rating} rating - {player.verifiedMatches} official matches</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <ActionSheet visible={!!activeEvent} title={activeEvent?.title || 'Tournament'} subtitle={activeEvent ? `${activeEvent.clubName} - ${activeEvent.timeLabel}` : undefined} onClose={() => setActiveEvent(null)}>
          {activeEvent ? (
            <>
              <Text style={styles.sheetText}>{activeEvent.description}</Text>
              <Text style={styles.sheetText}>Interest: {activeEvent.interestedPlayerIds.length} players - Entry: {activeEvent.entryFeeLabel}</Text>
              <PremiumButton label={activeEvent.registered ? 'Interest registered' : activeEvent.status === 'Waitlist' ? 'Be informed of next tournament' : 'Register interest'} icon={activeEvent.status === 'Waitlist' ? 'bell-outline' : 'check-decagram-outline'} onPress={() => registerTournamentInterest(activeEvent.id)} />
              <PremiumButton label="Submit result in this event" icon="clipboard-check-outline" variant="secondary" onPress={() => { setScoreSheet(activeEvent); setActiveEvent(null); }} />
            </>
          ) : null}
        </ActionSheet>

        <ActionSheet visible={!!scoreSheet} title="Submit tournament result" subtitle="Pending club verification before ranking moves." onClose={() => setScoreSheet(null)}>
          <Text style={styles.sheetText}>This flow is for verified tournament or approved club-event matches only.</Text>
          <TextInput value={score} onChangeText={setScore} placeholder="6-4, 6-3" placeholderTextColor={colors.textSecondary} style={styles.input} />
          <Text style={styles.sheetText}>Players: {currentUser.name} / {players[1].name} vs {players[3].name} / {players[4].name}</Text>
          <PremiumButton label="Submit for verification" icon="check-decagram-outline" onPress={submitResult} />
        </ActionSheet>
      </ScrollView>
    </ScreenTransitionWrapper>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { ...centeredContent, padding: spacing.md, gap: 18, paddingBottom: 104 },
  header: { backgroundColor: colors.darkSection, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: 18, gap: 8 },
  kicker: { color: colors.hotPink, fontWeight: '900', textTransform: 'uppercase', fontSize: 12 },
  title: { color: colors.textPrimary, fontSize: 34, fontWeight: '900' },
  copy: { color: colors.textSecondary, fontWeight: '800', lineHeight: 21 },
  info: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 6 },
  infoTitle: { color: colors.textPrimary, fontWeight: '900', fontSize: 16 },
  infoCopy: { color: colors.textSecondary, fontWeight: '800', lineHeight: 20 },
  stack: { gap: 12 },
  segment: { flexDirection: 'row', padding: 4, borderRadius: radius.pill, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.border },
  segmentItem: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: radius.pill },
  segmentActive: { backgroundColor: colors.primary },
  segmentText: { color: colors.textSecondary, fontWeight: '900', fontSize: 12 },
  segmentTextActive: { color: '#FFFFFF' },
  eventCard: { backgroundColor: colors.card, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 12 },
  pressed: { transform: [{ scale: 0.985 }, { translateY: 1 }] },
  eventTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  cardKicker: { color: colors.hotPink, fontWeight: '900', fontSize: 12, textTransform: 'uppercase' },
  cardTitle: { color: colors.textPrimary, fontWeight: '900', fontSize: 20, marginTop: 4 },
  cardMeta: { color: colors.textSecondary, fontWeight: '800', marginTop: 4 },
  cardCopy: { color: colors.textSecondary, fontWeight: '700', lineHeight: 20 },
  badge: { overflow: 'hidden', color: '#FFFFFF', backgroundColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 6, fontWeight: '900', fontSize: 11 },
  actions: { flexDirection: 'row', gap: 8 },
  message: { color: colors.pearl, fontWeight: '900', backgroundColor: colors.softMaroon, padding: 12, borderRadius: radius.md },
  sheetText: { color: colors.textSecondary, fontWeight: '800', lineHeight: 20 },
  input: { minHeight: 50, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 12, color: colors.textPrimary, fontWeight: '800', backgroundColor: colors.glass },
  rankPanel: { backgroundColor: colors.darkSection, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 12 },
  rankTitle: { color: colors.textPrimary, fontWeight: '900', fontSize: 24 },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.glass, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 12 },
  rankNumber: { width: 42, color: colors.hotPink, fontWeight: '900', fontSize: 17 },
  rankName: { color: colors.textPrimary, fontWeight: '900' },
  rankMeta: { color: colors.textSecondary, fontWeight: '800', marginTop: 3 },
});
