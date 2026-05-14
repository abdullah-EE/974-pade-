import { useMemo, useState } from 'react';
import * as Linking from 'expo-linking';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ActionSheet } from '@/components/common/ActionSheet';
import { ChallengeCard } from '@/components/common/ChallengeCard';
import { CourtCard } from '@/components/common/CourtCard';
import { HorizontalCardRail } from '@/components/common/HorizontalCardRail';
import { MatchCard } from '@/components/common/MatchCard';
import { PremiumButton } from '@/components/common/PremiumButton';
import { ScreenTransitionWrapper } from '@/components/common/ScreenTransitionWrapper';
import { useAppState } from '@/state/AppState';
import { colors, radius, spacing } from '@/theme/tokens';
import { centeredContent } from '@/theme/layout';
import { Challenge, Court, Level, Match, Player } from '@/types/models';
import { formatGameTime } from '@/utils/format';
import { isValidScore } from '@/utils/validation';

const levels: Level[] = ['Beginner', 'Intermediate', 'Advanced'];
const dates = ['Tonight', 'Tomorrow', 'Saturday'];
const times = ['7:30 PM', '8:30 PM', '9:30 PM'];

function startsAtFor(date: string, time: string) {
  const day = date === 'Tonight' ? '14' : date === 'Tomorrow' ? '15' : '16';
  const hour = time === '7:30 PM' ? '19:30' : time === '8:30 PM' ? '20:30' : '21:30';
  return `2026-05-${day}T${hour}:00+03:00`;
}

export default function PlayScreen() {
  const {
    challenges,
    conversations,
    courts,
    matches,
    players,
    currentUser,
    friendIds,
    createChallenge,
    updateChallenge,
    updateMatchStatus,
    submitFriendlyResult,
    sendConversationMessage,
  } = useAppState();
  const [tab, setTab] = useState<'Challenge' | 'Submit'>('Challenge');
  const [sheet, setSheet] = useState<'challenge' | 'result' | 'court' | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [mode, setMode] = useState<'opponent' | 'open game'>('opponent');
  const [opponentId, setOpponentId] = useState(players[4]?.id || 'p5');
  const [courtId, setCourtId] = useState(courts[0].id);
  const [date, setDate] = useState('Tonight');
  const [time, setTime] = useState('8:30 PM');
  const [level, setLevel] = useState<Level>('Intermediate');
  const [confirmedBooking, setConfirmedBooking] = useState(false);
  const [composer, setComposer] = useState('Can you play after work? I can book the court.');
  const [note, setNote] = useState('Friendly match. Profile stats only.');
  const [score, setScore] = useState('6-4, 6-3');
  const [message, setMessage] = useState('');

  const selectedOpponent = players.find((player) => player.id === opponentId) || players[1];
  const selectedCourtForForm = courts.find((court) => court.id === courtId) || courts[0];
  const conversation = conversations.find((item) => item.participantIds.includes(currentUser.id) && item.participantIds.includes(opponentId));
  const friendlyChallenges = useMemo(() => challenges.filter((challenge) => String(challenge.status).toLowerCase() !== 'declined'), [challenges]);
  const friendlyMatches = useMemo(() => matches.filter((match) => match.friendlyStatsOnly || match.rankingSource === 'friendly').slice(0, 8), [matches]);

  const sendMessage = () => {
    if (mode === 'open game') {
      setMessage('Open games skip direct chat. Add the time and court, then post it.');
      return;
    }
    sendConversationMessage(opponentId, composer);
    setComposer('');
  };

  const createFriendly = () => {
    if (!confirmedBooking) {
      setMessage('Confirm the court/time is already booked or available before creating the friendly.');
      return;
    }
    createChallenge({
      opponentId: mode === 'opponent' ? opponentId : undefined,
      opponentIds: mode === 'opponent' ? [opponentId] : [],
      courtId,
      startsAt: startsAtFor(date, time),
      level,
      note,
      privacy: mode === 'open game' ? 'Public' : 'Friends only',
      type: mode === 'open game' ? 'open game' : 'doubles',
    });
    setSheet(null);
    setTab('Submit');
    setMessage('Friendly challenge created. Any result here updates profile stats only.');
  };

  const openResult = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setScore('6-4, 6-3');
    setSheet('result');
  };

  const submitResult = () => {
    if (!selectedChallenge) return;
    if (!isValidScore(score)) {
      setMessage('Use a score like 6-4, 6-3.');
      return;
    }
    submitFriendlyResult(selectedChallenge.id, score);
    setSheet(null);
    setMessage('Friendly result saved. Official ranking did not change.');
  };

  const openClubBooking = async () => {
    if (!selectedCourt) return;
    await Linking.openURL(selectedCourt.bookingUrl);
    setSheet(null);
  };

  const renderChallenge = (challenge: Challenge) => {
    const opponent = players.find((player) => player.id === (challenge.from === currentUser.id ? challenge.to : challenge.from)) || selectedOpponent;
    const court = courts.find((item) => item.id === challenge.courtId) || courts[0];
    return (
      <ChallengeCard
        key={challenge.id}
        challenge={challenge}
        opponent={opponent as Player}
        court={court}
        onOpen={() => openResult(challenge)}
        onAccept={() => updateChallenge(challenge.id, 'Accepted')}
        onDecline={() => updateChallenge(challenge.id, 'Declined')}
      />
    );
  };

  return (
    <ScreenTransitionWrapper>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Friendly play</Text>
          <Text style={styles.title}>Challenge, chat, submit</Text>
          <Text style={styles.copy}>Friendly challenges help players connect and update profile stats only. Official ranking is reserved for verified tournaments and approved club events.</Text>
        </View>

        <View style={styles.segment}>
          {(['Challenge', 'Submit'] as const).map((item) => (
            <Pressable key={item} onPress={() => setTab(item)} style={({ pressed }) => [styles.segmentItem, tab === item && styles.segmentActive, pressed && styles.pressed]}>
              <Text style={[styles.segmentText, tab === item && styles.segmentTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        {message ? <Text style={styles.message}>{message}</Text> : null}

        {tab === 'Challenge' ? (
          <>
            <View style={styles.panel}>
              <Text style={styles.panelTitle}>Start with a message</Text>
              <Text style={styles.panelCopy}>Agree on the time before sending the friendly challenge.</Text>
              <View style={styles.playerGrid}>
                {players.filter((player) => player.id !== currentUser.id && (friendIds.includes(player.id) || player.level === level)).slice(0, 8).map((player) => (
                  <Pressable key={player.id} onPress={() => setOpponentId(player.id)} style={({ pressed }) => [styles.playerChip, opponentId === player.id && styles.playerChipActive, pressed && styles.pressed]}>
                    <Text numberOfLines={1} style={[styles.playerChipText, opponentId === player.id && styles.playerChipTextActive]}>{player.name}</Text>
                  </Pressable>
                ))}
              </View>
              <View style={styles.chatBox}>
                {(conversation?.messages || [
                  { id: 'seed-1', senderId: selectedOpponent.id, text: 'Message me the court and time before you send it.' },
                ]).slice(-3).map((item) => {
                  const mine = item.senderId === currentUser.id;
                  return <Text key={item.id} style={[styles.bubble, mine && styles.bubbleMine]}>{item.text}</Text>;
                })}
              </View>
              <View style={styles.composer}>
                <TextInput value={composer} onChangeText={setComposer} placeholder="Message before challenge" placeholderTextColor={colors.textSecondary} style={styles.composerInput} />
                <PremiumButton label="Send" icon="send-outline" onPress={sendMessage} />
              </View>
              <PremiumButton label="Create friendly challenge" icon="plus" onPress={() => setSheet('challenge')} />
            </View>

            <View style={styles.panel}>
              <Text style={styles.panelTitle}>Need a court?</Text>
              <Text style={styles.panelCopy}>Booking happens through the club's official channel. 974 Padel does not show live court availability.</Text>
              <HorizontalCardRail>
                {courts.slice(0, 5).map((court) => (
                  <CourtCard key={court.id} compact court={court} onOpen={() => { setSelectedCourt(court); setSheet('court'); }} onBook={() => { setSelectedCourt(court); setSheet('court'); }} onStartRanked={() => setSheet('challenge')} />
                ))}
              </HorizontalCardRail>
            </View>

            <View style={styles.stack}>{friendlyChallenges.slice(0, 5).map(renderChallenge)}</View>
          </>
        ) : (
          <>
            <View style={styles.panel}>
              <Text style={styles.panelTitle}>Pending friendly results</Text>
              <Text style={styles.panelCopy}>Submit from the friendly match flow. Opponents can confirm or dispute. Ranking stays unchanged.</Text>
              <View style={styles.stack}>{friendlyChallenges.slice(0, 5).map(renderChallenge)}</View>
            </View>
            <View style={styles.panel}>
              <Text style={styles.panelTitle}>Friendly stats history</Text>
              <View style={styles.stack}>
                {friendlyMatches.length ? friendlyMatches.map((match: Match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    court={courts.find((court) => court.id === match.courtId) || courts[0]}
                    players={players}
                    onConfirm={match.status === 'Pending' ? () => updateMatchStatus(match.id, 'Verified') : undefined}
                    onDispute={match.status === 'Pending' ? () => updateMatchStatus(match.id, 'Disputed') : undefined}
                  />
                )) : <Text style={styles.panelCopy}>No friendly results yet. Create a challenge first.</Text>}
              </View>
            </View>
          </>
        )}

        <ActionSheet visible={sheet === 'challenge'} title="Friendly challenge details" subtitle="Stats only. No official ranking impact." onClose={() => setSheet(null)}>
          <Text style={styles.sheetLabel}>Opponent or open game</Text>
          <View style={styles.selector}>
            {(['opponent', 'open game'] as const).map((item) => (
              <PremiumButton key={item} label={item} variant={mode === item ? 'primary' : 'subtle'} onPress={() => setMode(item)} style={{ flex: 1 }} />
            ))}
          </View>
          <Text style={styles.sheetLabel}>Court</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selector}>
            {courts.slice(0, 8).map((court) => (
              <Pressable key={court.id} onPress={() => setCourtId(court.id)} style={({ pressed }) => [styles.choice, courtId === court.id && styles.choiceActive, pressed && styles.pressed]}>
                <Text numberOfLines={1} style={[styles.choiceText, courtId === court.id && styles.choiceTextActive]}>{court.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <Text style={styles.sheetLabel}>Date</Text>
          <View style={styles.selector}>{dates.map((item) => <PremiumButton key={item} label={item} variant={date === item ? 'primary' : 'subtle'} onPress={() => setDate(item)} style={{ flex: 1 }} />)}</View>
          <Text style={styles.sheetLabel}>Time</Text>
          <View style={styles.selector}>{times.map((item) => <PremiumButton key={item} label={item} variant={time === item ? 'primary' : 'subtle'} onPress={() => setTime(item)} style={{ flex: 1 }} />)}</View>
          <Text style={styles.sheetLabel}>Level</Text>
          <View style={styles.selector}>{levels.map((item) => <PremiumButton key={item} label={item} variant={level === item ? 'primary' : 'subtle'} onPress={() => setLevel(item)} style={{ flex: 1 }} />)}</View>
          <TextInput value={note} onChangeText={setNote} placeholder="Friendly note" placeholderTextColor={colors.textSecondary} style={styles.input} />
          <Pressable onPress={() => setConfirmedBooking((value) => !value)} style={({ pressed }) => [styles.confirm, confirmedBooking && styles.confirmActive, pressed && styles.pressed]}>
            <Text style={[styles.confirmText, confirmedBooking && styles.confirmTextActive]}>I confirm this court/time is already booked or available.</Text>
            <Text style={styles.confirmMeta}>{selectedCourtForForm.name} - {date}, {time}</Text>
          </Pressable>
          <PremiumButton label="Send friendly challenge" icon="send-outline" onPress={createFriendly} />
        </ActionSheet>

        <ActionSheet visible={sheet === 'result'} title="Submit friendly result" subtitle="Opponent can confirm or dispute. Ranking stays unchanged." onClose={() => setSheet(null)}>
          <Text style={styles.sheetText}>{selectedChallenge ? `${formatGameTime(selectedChallenge.startsAt)} at ${courts.find((court) => court.id === selectedChallenge.courtId)?.name}` : 'Friendly match'}</Text>
          <TextInput value={score} onChangeText={setScore} placeholder="6-4, 6-3" placeholderTextColor={colors.textSecondary} style={styles.input} />
          <PremiumButton label="Save friendly result" icon="check" onPress={submitResult} />
        </ActionSheet>

        <ActionSheet visible={sheet === 'court'} title="Book via club" subtitle={selectedCourt?.name} onClose={() => setSheet(null)}>
          <Text style={styles.sheetText}>Booking happens through the club's official channel. 974 Padel does not show live court availability.</Text>
          <PremiumButton label="Book via club" icon="open-in-new" onPress={openClubBooking} />
        </ActionSheet>
      </ScrollView>
    </ScreenTransitionWrapper>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { ...centeredContent, padding: spacing.md, gap: 18, paddingBottom: 104 },
  header: { backgroundColor: colors.darkSection, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: 18, gap: 9 },
  kicker: { color: colors.hotPink, fontWeight: '900', textTransform: 'uppercase', fontSize: 12 },
  title: { color: colors.textPrimary, fontWeight: '900', fontSize: 32, lineHeight: 37 },
  copy: { color: colors.textSecondary, fontWeight: '800', lineHeight: 21 },
  segment: { flexDirection: 'row', padding: 4, borderRadius: radius.pill, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.border },
  segmentItem: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: radius.pill },
  segmentActive: { backgroundColor: colors.primary },
  segmentText: { color: colors.textSecondary, fontWeight: '900' },
  segmentTextActive: { color: '#FFFFFF' },
  panel: { backgroundColor: colors.card, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 12 },
  panelTitle: { color: colors.textPrimary, fontWeight: '900', fontSize: 18 },
  panelCopy: { color: colors.textSecondary, fontWeight: '800', lineHeight: 20 },
  playerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  playerChip: { maxWidth: 180, paddingHorizontal: 12, paddingVertical: 9, borderRadius: radius.pill, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.border },
  playerChipActive: { backgroundColor: colors.softMaroon, borderColor: colors.hotPink },
  playerChipText: { color: colors.textSecondary, fontWeight: '900' },
  playerChipTextActive: { color: colors.pearl },
  chatBox: { gap: 8, padding: 10, borderRadius: radius.lg, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: colors.border },
  bubble: { alignSelf: 'flex-start', maxWidth: '86%', overflow: 'hidden', color: colors.pearl, backgroundColor: colors.glass, borderRadius: radius.lg, paddingHorizontal: 12, paddingVertical: 9, fontWeight: '800', lineHeight: 19 },
  bubbleMine: { alignSelf: 'flex-end', backgroundColor: colors.primary },
  composer: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  composerInput: { flex: 1, minHeight: 48, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: 14, color: colors.textPrimary, fontWeight: '800', backgroundColor: colors.glass },
  stack: { gap: 10 },
  message: { color: colors.pearl, fontWeight: '900', backgroundColor: colors.softMaroon, padding: 12, borderRadius: radius.md },
  selector: { flexDirection: 'row', gap: 8 },
  choice: { maxWidth: 190, paddingHorizontal: 12, paddingVertical: 9, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill },
  choiceActive: { backgroundColor: colors.primary, borderColor: colors.hotPink },
  choiceText: { color: colors.textSecondary, fontWeight: '900' },
  choiceTextActive: { color: '#FFFFFF' },
  pressed: { transform: [{ scale: 0.98 }, { translateY: 1 }] },
  sheetLabel: { color: colors.textPrimary, fontWeight: '900' },
  sheetText: { color: colors.textSecondary, fontWeight: '800', lineHeight: 20 },
  input: { minHeight: 50, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 12, color: colors.textPrimary, fontWeight: '800', backgroundColor: colors.glass },
  confirm: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.glass, borderRadius: radius.lg, padding: 12, gap: 4 },
  confirmActive: { backgroundColor: colors.softMaroon, borderColor: colors.hotPink },
  confirmText: { color: colors.textPrimary, fontWeight: '900', lineHeight: 20 },
  confirmTextActive: { color: '#FFFFFF' },
  confirmMeta: { color: colors.textSecondary, fontWeight: '800' },
});
