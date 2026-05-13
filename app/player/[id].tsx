import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActionSheet } from '@/components/common/ActionSheet';
import { MatchCard } from '@/components/common/MatchCard';
import { PlayerAvatar } from '@/components/common/PlayerAvatar';
import { PremiumButton } from '@/components/common/PremiumButton';
import { SectionHeader } from '@/components/common/SectionHeader';
import { VerificationBadge } from '@/components/common/VerificationBadge';
import { useAppState } from '@/state/AppState';
import { colors, radius, spacing } from '@/theme/tokens';
import { winRate } from '@/utils/format';

export default function PlayerDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { courts, matches, players, currentUser, friendIds, addFriend, removeFriend, createChallenge } = useAppState();
  const player = players.find((item) => item.id === id) || players[0];
  const favoriteCourt = courts.find((court) => court.id === player.favoriteCourtId) || courts[0];
  const [sheet, setSheet] = useState<'challenge' | 'compare' | null>(null);
  const playerMatches = matches.filter((match) => [...match.teamA, ...match.teamB].includes(player.id)).slice(0, 5);
  const isFriend = friendIds.includes(player.id);
  const isSelf = player.id === currentUser.id;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.back, pressed && styles.backPressed]}>
          <MaterialCommunityIcons name="chevron-left" size={26} color="#FFFFFF" />
        </Pressable>
        <PlayerAvatar name={player.name} uri={player.avatar} size={96} />
        <Text style={styles.name}>{player.name}</Text>
        <Text style={styles.username}>{player.username}</Text>
        <Text style={styles.username}>{player.status === 'playingTonight' ? 'Playing tonight' : player.status || 'recently active'} - {player.club}</Text>
        <View style={styles.badges}>
          {player.verified ? <VerificationBadge /> : null}
          <VerificationBadge label="Top 100" />
          {player.streak >= 3 ? <VerificationBadge label="Hot Streak" /> : null}
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}><Text style={styles.statValue}>#{player.rank}</Text><Text style={styles.statLabel}>Qatar rank</Text></View>
        <View style={styles.stat}><Text style={styles.statValue}>{player.rating}</Text><Text style={styles.statLabel}>Rating</Text></View>
        <View style={styles.stat}><Text style={styles.statValue}>{winRate(player.wins, player.losses)}%</Text><Text style={styles.statLabel}>Win rate</Text></View>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>Favorite court: {favoriteCourt.name}</Text>
        <Text style={styles.infoText}>Skill level: {player.level}</Text>
        <Text style={styles.infoText}>Verified record: {player.wins}-{player.losses}</Text>
        <Text style={styles.infoText}>Verified matches: {player.verifiedMatches}</Text>
      </View>

      <View style={styles.actions}>
        {!isSelf ? <PremiumButton label="Challenge" icon="sword-cross" onPress={() => setSheet('challenge')} style={{ flex: 1 }} /> : null}
        <PremiumButton label="Compare" variant="secondary" icon="compare-horizontal" onPress={() => setSheet('compare')} style={{ flex: 1 }} />
      </View>
      {!isSelf ? (
        <View style={styles.actions}>
          <PremiumButton label={isFriend ? 'Remove friend' : 'Add friend'} icon={isFriend ? 'account-minus-outline' : 'account-plus-outline'} variant="subtle" onPress={() => (isFriend ? removeFriend(player.id) : addFriend(player.id))} style={{ flex: 1 }} />
        </View>
      ) : null}

      <View>
        <SectionHeader title="Recent Matches" />
        <View style={styles.stack}>
          {playerMatches.map((match) => (
            <MatchCard key={match.id} match={match} court={courts.find((court) => court.id === match.courtId) || courts[0]} players={players} />
          ))}
        </View>
      </View>

      <ActionSheet visible={sheet === 'challenge'} title="Create challenge" subtitle={`Send ${player.name} a ranked challenge at ${favoriteCourt.name}.`} onClose={() => setSheet(null)}>
        <PremiumButton label="Send challenge request" icon="send-outline" onPress={() => {
          createChallenge({ opponentId: player.id, opponentIds: [player.id], courtId: favoriteCourt.id, startsAt: '2026-05-13T20:30:00+03:00', level: player.level, note: `Challenge from ${currentUser.name}`, privacy: 'Private invite', type: 'doubles' });
          setSheet(null);
        }} />
      </ActionSheet>

      <ActionSheet visible={sheet === 'compare'} title="Player comparison" subtitle="Local comparison now; backend ranking model plugs in later." onClose={() => setSheet(null)}>
        <View style={styles.compare}>
          <Text style={styles.compareText}>You: rating {currentUser.rating}, rank #{currentUser.rank}</Text>
          <Text style={styles.compareText}>{player.name}: rating {player.rating}, rank #{player.rank}</Text>
          <Text style={styles.compareText}>Projected match impact: 8-14 rating points</Text>
        </View>
      </ActionSheet>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 42, gap: 20 },
  header: { alignItems: 'center', backgroundColor: colors.primary, paddingTop: 58, paddingBottom: 24, paddingHorizontal: spacing.md },
  back: { position: 'absolute', top: 52, left: 14, width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  backPressed: { transform: [{ scale: 0.92 }] },
  name: { marginTop: 12, color: '#FFFFFF', fontSize: 28, fontWeight: '900', textAlign: 'center' },
  username: { marginTop: 4, color: '#F2DCE7', fontWeight: '800' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 14 },
  stats: { marginHorizontal: spacing.md, flexDirection: 'row', gap: 10 },
  stat: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.border },
  statValue: { color: colors.textPrimary, fontWeight: '900', fontSize: 22 },
  statLabel: { color: colors.textSecondary, fontWeight: '800', marginTop: 4, fontSize: 12 },
  info: { marginHorizontal: spacing.md, backgroundColor: '#FFFFFF', borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.border, gap: 8 },
  infoText: { color: colors.textPrimary, fontWeight: '800' },
  actions: { marginHorizontal: spacing.md, flexDirection: 'row', gap: 10 },
  stack: { marginHorizontal: spacing.md, gap: 10 },
  compare: { gap: 10 },
  compareText: { color: colors.textPrimary, fontWeight: '800' },
});
