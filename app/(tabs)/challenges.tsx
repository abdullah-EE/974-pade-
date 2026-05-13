import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MotiView } from 'moti';
import { ActionSheet } from '@/components/common/ActionSheet';
import { ChallengeCard } from '@/components/common/ChallengeCard';
import { CollapsibleSection } from '@/components/common/CollapsibleSection';
import { HorizontalCardRail } from '@/components/common/HorizontalCardRail';
import { OpenGameCard } from '@/components/common/OpenGameCard';
import { PremiumButton } from '@/components/common/PremiumButton';
import { useAppState } from '@/state/AppState';
import { colors, radius, spacing } from '@/theme/tokens';
import { centeredContent } from '@/theme/layout';
import { Challenge, Level } from '@/types/models';

const levels: Level[] = ['Beginner', 'Intermediate', 'Advanced'];
const privacyOptions: NonNullable<Challenge['privacy']>[] = ['Public', 'Friends only', 'Private invite'];
const timeOptions = [
  { label: 'Tonight, 8:30 PM', value: '2026-05-12T20:30:00+03:00' },
  { label: 'Tomorrow, 7:30 PM', value: '2026-05-13T19:30:00+03:00' },
  { label: 'Tomorrow, 9:00 PM', value: '2026-05-13T21:00:00+03:00' },
];

export default function ChallengesScreen() {
  const { challenges, courts, openGames, players, currentUser, friendIds, createChallenge, updateChallenge, joinOpenGame } = useAppState();
  const [sheet, setSheet] = useState(false);
  const [success, setSuccess] = useState(false);
  const [courtId, setCourtId] = useState(courts[0].id);
  const [opponentId, setOpponentId] = useState(players[4].id);
  const [level, setLevel] = useState<Level>('Intermediate');
  const [startsAt, setStartsAt] = useState(timeOptions[0].value);
  const [note, setNote] = useState('Competitive but friendly ranked set.');
  const [opponentQuery, setOpponentQuery] = useState('');
  const [privacy, setPrivacy] = useState<NonNullable<Challenge['privacy']>>('Friends only');
  const [challengeType, setChallengeType] = useState<NonNullable<Challenge['type']>>('doubles');
  const [openInvite, setOpenInvite] = useState(false);
  const [detail, setDetail] = useState<Challenge | null>(null);

  const submitChallenge = () => {
    createChallenge({ opponentId: openInvite ? undefined : opponentId, opponentIds: openInvite ? [] : [opponentId], courtId, startsAt, level, note, privacy, type: challengeType });
    setSheet(false);
    setSuccess(true);
  };

  const renderChallenges = (status: Challenge['status']) => {
    const items = challenges.filter((challenge) => challenge.status === status);
    return (
      <View style={styles.stack}>
        {items.map((challenge) => {
          const opponent = players.find((player) => player.id === (challenge.from === currentUser.id ? challenge.to : challenge.from)) || players[0];
          const court = courts.find((item) => item.id === challenge.courtId) || courts[0];
          return <ChallengeCard key={challenge.id} challenge={challenge} opponent={opponent} court={court} onOpen={() => setDetail(challenge)} onAccept={() => updateChallenge(challenge.id, 'Accepted')} onDecline={() => updateChallenge(challenge.id, 'Declined')} />;
        })}
      </View>
    );
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.kicker}>Games and rivalries</Text>
          <Text style={styles.title}>Challenges</Text>
        </View>
        <PremiumButton label="Create" icon="plus" onPress={() => setSheet(true)} />
      </View>

      <CollapsibleSection title="Create Challenge" action="Singles, doubles, open game" defaultOpen>
        <PremiumButton label="Create new challenge" icon="plus" onPress={() => setSheet(true)} />
      </CollapsibleSection>

      <CollapsibleSection title="Open Games" action={`${openGames.length} live`} defaultOpen>
        <HorizontalCardRail>
          {openGames.map((game) => (
            <OpenGameCard
              key={game.id}
              game={game}
              court={courts.find((court) => court.id === game.courtId) || courts[0]}
              players={players}
              onJoin={() => joinOpenGame(game.id)}
            />
          ))}
        </HorizontalCardRail>
      </CollapsibleSection>

      <CollapsibleSection title="Incoming" action="Accept or decline" defaultOpen>{renderChallenges('Incoming')}</CollapsibleSection>
      <CollapsibleSection title="Sent" action="Waiting on rivals">{renderChallenges('Sent')}</CollapsibleSection>
      <CollapsibleSection title="Accepted" action="Ready to play">{renderChallenges('Accepted')}</CollapsibleSection>
      <CollapsibleSection title="Friends Only" action="Local privacy view">{renderChallenges('Sent')}</CollapsibleSection>
      <CollapsibleSection title="Private Invites" action="Invite-only matches">{renderChallenges('Incoming')}</CollapsibleSection>

      <ActionSheet visible={sheet} title="Create Challenge" subtitle="Pick a rival, venue, level, and time. This stays local for now." onClose={() => setSheet(false)}>
        <Text style={styles.sheetLabel}>Court</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selector}>
          {courts.slice(0, 6).map((court) => (
            <Pressable key={court.id} onPress={() => setCourtId(court.id)} style={({ pressed }) => [styles.choice, courtId === court.id && styles.choiceActive, pressed && styles.pressedChoice]}>
              <Text style={[styles.choiceText, courtId === court.id && styles.choiceTextActive]}>{court.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <Text style={styles.sheetLabel}>Opponent</Text>
        <TextInput value={opponentQuery} onChangeText={setOpponentQuery} placeholder="Search opponent" placeholderTextColor={colors.textSecondary} style={styles.input} />
        <Text style={styles.sheetLabel}>Challenge type</Text>
        <View style={styles.selector}>
          {(['singles', 'doubles', 'open game'] as const).map((item) => (
            <Pressable key={item} onPress={() => setChallengeType(item)} style={({ pressed }) => [styles.choice, challengeType === item && styles.choiceActive, pressed && styles.pressedChoice]}>
              <Text style={[styles.choiceText, challengeType === item && styles.choiceTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.sheetLabel}>Privacy</Text>
        <View style={styles.selector}>
          {privacyOptions.map((option) => (
            <Pressable key={option} onPress={() => setPrivacy(option)} style={({ pressed }) => [styles.choice, privacy === option && styles.choiceActive, pressed && styles.pressedChoice]}>
              <Text style={[styles.choiceText, privacy === option && styles.choiceTextActive]}>{option}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable onPress={() => setOpenInvite((value) => !value)} style={({ pressed }) => [styles.openInvite, openInvite && styles.choiceActive, pressed && styles.pressedChoice]}>
          <Text style={[styles.choiceText, openInvite && styles.choiceTextActive]}>{openInvite ? 'Open invite enabled' : 'Select a specific opponent'}</Text>
          <Text style={[styles.openInviteMeta, openInvite && styles.choiceTextActive]}>{openInvite ? 'Creates a public/open game when privacy is Public.' : 'Private and friends-only challenges use selected players.'}</Text>
        </Pressable>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selector}>
          {!openInvite ? players
            .filter((player) => player.id !== currentUser.id)
            .filter((player) => privacy === 'Public' || friendIds.includes(player.id))
            .filter((player) => `${player.name} ${player.username}`.toLowerCase().includes(opponentQuery.trim().toLowerCase()))
            .slice(0, 8)
            .map((player) => (
            <Pressable key={player.id} onPress={() => setOpponentId(player.id)} style={({ pressed }) => [styles.choice, opponentId === player.id && styles.choiceActive, pressed && styles.pressedChoice]}>
              <Text style={[styles.choiceText, opponentId === player.id && styles.choiceTextActive]}>{player.name}</Text>
            </Pressable>
          )) : null}
        </ScrollView>
        <Text style={styles.sheetLabel}>Level</Text>
        <View style={styles.selector}>
          {levels.map((item) => (
            <Pressable key={item} onPress={() => setLevel(item)} style={({ pressed }) => [styles.choice, level === item && styles.choiceActive, pressed && styles.pressedChoice]}>
              <Text style={[styles.choiceText, level === item && styles.choiceTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.sheetLabel}>Time</Text>
        <View style={styles.selector}>
          {timeOptions.map((item) => (
            <Pressable key={item.value} onPress={() => setStartsAt(item.value)} style={({ pressed }) => [styles.choice, startsAt === item.value && styles.choiceActive, pressed && styles.pressedChoice]}>
              <Text style={[styles.choiceText, startsAt === item.value && styles.choiceTextActive]}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.sheetLabel}>Note</Text>
        <TextInput value={note} onChangeText={setNote} placeholder="Optional message" multiline style={styles.note} />
        <PremiumButton label="Send challenge" icon="send-outline" onPress={submitChallenge} />
      </ActionSheet>

      <ActionSheet visible={success} title="Challenge sent" subtitle="Your challenge now appears in Sent Challenges and can be updated locally." onClose={() => setSuccess(false)}>
        <MotiView from={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'timing', duration: 260 }} style={styles.success}>
          <Text style={styles.successText}>{openInvite ? 'Open game created' : `Sent to ${players.find((player) => player.id === opponentId)?.name}`}</Text>
        </MotiView>
        <PremiumButton label="Done" icon="check" onPress={() => setSuccess(false)} />
      </ActionSheet>

      <ActionSheet visible={!!detail} title="Challenge detail" subtitle={detail ? `${detail.privacy || 'Public'} at ${courts.find((court) => court.id === detail.courtId)?.name}` : undefined} onClose={() => setDetail(null)}>
        {detail ? (
          <>
            <Text style={styles.sheetLabel}>Status</Text>
            <Text style={styles.detailText}>{detail.status} - {detail.level} - {timeOptions.find((item) => item.value === detail.startsAt)?.label || 'Upcoming'}</Text>
            {detail.note ? <Text style={styles.detailText}>{detail.note}</Text> : null}
            {detail.status === 'Incoming' ? (
              <View style={styles.detailActions}>
                <PremiumButton label="Accept" icon="check" onPress={() => { updateChallenge(detail.id, 'Accepted'); setDetail(null); }} style={{ flex: 1 }} />
                <PremiumButton label="Decline" icon="close" variant="subtle" onPress={() => { updateChallenge(detail.id, 'Declined'); setDetail(null); }} style={{ flex: 1 }} />
              </View>
            ) : (
              <PremiumButton label="Close" icon="check" onPress={() => setDetail(null)} />
            )}
          </>
        ) : null}
      </ActionSheet>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { ...centeredContent, padding: spacing.md, gap: 22, paddingBottom: 104 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  kicker: { color: colors.primary, fontWeight: '900', textTransform: 'uppercase', fontSize: 12 },
  title: { color: colors.textPrimary, fontSize: 34, fontWeight: '900', marginTop: 3 },
  horizontal: { gap: 12, paddingRight: spacing.md },
  stack: { gap: 10 },
  sheetLabel: { color: colors.textPrimary, fontWeight: '900' },
  selector: { flexDirection: 'row', gap: 8, paddingRight: spacing.md },
  choice: { paddingHorizontal: 12, paddingVertical: 9, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill },
  choiceActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pressedChoice: { transform: [{ scale: 0.96 }, { translateY: 1 }] },
  choiceText: { color: colors.textSecondary, fontWeight: '800' },
  choiceTextActive: { color: '#FFFFFF' },
  openInvite: { gap: 4, padding: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md },
  openInviteMeta: { color: colors.textSecondary, fontWeight: '700', fontSize: 12 },
  input: { minHeight: 46, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: 14, color: colors.textPrimary, fontWeight: '800', backgroundColor: '#FFFFFF' },
  note: { minHeight: 72, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12, color: colors.textPrimary, fontWeight: '800', backgroundColor: '#FFFFFF' },
  detailText: { color: colors.textSecondary, fontWeight: '800', lineHeight: 20 },
  detailActions: { flexDirection: 'row', gap: 8 },
  success: { backgroundColor: colors.softMaroon, borderRadius: radius.lg, padding: 16 },
  successText: { color: colors.primary, fontWeight: '900', textAlign: 'center' },
});
