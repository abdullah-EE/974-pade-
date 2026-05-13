import { useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ActionSheet } from '@/components/common/ActionSheet';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { MatchCard } from '@/components/common/MatchCard';
import { PlayerAvatar } from '@/components/common/PlayerAvatar';
import { PremiumButton } from '@/components/common/PremiumButton';
import { ScreenTransitionWrapper } from '@/components/common/ScreenTransitionWrapper';
import { useAppState } from '@/state/AppState';
import { colors, radius, spacing } from '@/theme/tokens';
import { centeredContent } from '@/theme/layout';
import { Match } from '@/types/models';
import { isValidScore, validateImageAsset } from '@/utils/validation';

const steps = ['Court', 'Players', 'Score', 'Proof + Review'];

export default function SubmitScreen() {
  const { courtId } = useLocalSearchParams<{ courtId?: string }>();
  const { courts, players, matches, currentUser, friendIds, addMatch, updateMatchStatus } = useAppState();
  const [step, setStep] = useState(0);
  const [selectedCourtId, setSelectedCourtId] = useState(courtId || courts[0].id);
  const [teamA, setTeamA] = useState<string[]>([currentUser.id]);
  const [teamB, setTeamB] = useState<string[]>(['p2']);
  const [playerQuery, setPlayerQuery] = useState('');
  const [friendsOnly, setFriendsOnly] = useState(false);
  const [score, setScore] = useState('6-4, 6-3');
  const [proofUri, setProofUri] = useState<string | undefined>();
  const [proofMessage, setProofMessage] = useState('Attach a scoreboard, court, or post-match proof photo.');
  const [done, setDone] = useState(false);
  const selectedCourt = courts.find((court) => court.id === selectedCourtId) || courts[0];
  const pendingMatches = useMemo(() => matches.filter((match) => match.status === 'Pending').slice(0, 3), [matches]);

  const togglePlayer = (id: string) => {
    if (teamA.includes(id)) setTeamA(teamA.filter((item) => item !== id));
    else if (teamB.includes(id)) setTeamB(teamB.filter((item) => item !== id));
    else if (teamA.length < 2) setTeamA([...teamA, id]);
    else if (teamB.length < 2) setTeamB([...teamB, id]);
  };

  const submitMatch = () => {
    if (!isValidScore(score)) {
      setProofMessage('Use a score like 6-4, 6-3 before submitting.');
      setStep(2);
      return;
    }
    const newMatch: Match = {
      id: `local-${Date.now()}`,
      teamA,
      teamB,
      winner: 'A',
      score,
      courtId: selectedCourt.id,
      startsAt: '2026-05-12T21:30:00+03:00',
      ratingChange: 0,
      status: 'Pending',
      proofUri,
    };
    addMatch(newMatch);
    setDone(true);
  };

  const pickProof = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled) {
      const validation = validateImageAsset(result.assets[0]);
      if (!validation.ok) {
        setProofMessage(validation.message);
        return;
      }
      setProofUri(result.assets[0].uri);
      setProofMessage('Proof photo attached locally.');
    }
  };

  const takeProof = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setProofMessage('Camera permission was denied. You can still attach proof from your library.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled) {
      const validation = validateImageAsset(result.assets[0]);
      if (!validation.ok) {
        setProofMessage(validation.message);
        return;
      }
      setProofUri(result.assets[0].uri);
      setProofMessage('Camera proof attached locally.');
    }
  };
  const cancelFlow = () => {
    setStep(0);
    setSelectedCourtId(courtId || courts[0].id);
    setTeamA([currentUser.id]);
    setTeamB(['p2']);
    setPlayerQuery('');
    setFriendsOnly(false);
    setScore('6-4, 6-3');
    setProofUri(undefined);
    setProofMessage('Attach a scoreboard, court, or post-match proof photo.');
  };

  return (
    <ScreenTransitionWrapper>
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View>
        <Text style={styles.kicker}>Verified match submission</Text>
        <Text style={styles.title}>Submit Match</Text>
      </View>
      <View style={styles.progress}>
        {steps.map((label, index) => (
          <View key={label} style={[styles.step, index <= step && styles.stepActive]}>
            <Text style={[styles.stepText, index <= step && styles.stepTextActive]}>{index + 1}</Text>
          </View>
        ))}
      </View>
      <View style={styles.stepHeader}>
        <Text style={styles.stepLabel}>{steps[step]}</Text>
        <PremiumButton label="Cancel" variant="subtle" icon="close" onPress={cancelFlow} />
      </View>

      {step === 0 ? (
        <View style={styles.wizardPanel}>
          <Text style={styles.cardTitle}>Choose court</Text>
          {courts.map((court) => (
            <Pressable key={court.id} onPress={() => setSelectedCourtId(court.id)} style={({ pressed }) => [styles.court, selectedCourtId === court.id && styles.selected, pressed && styles.pressed]}>
              <ImageWithFallback uri={court.image} style={styles.courtImage} label={court.name} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text numberOfLines={1} style={styles.cardTitle}>{court.name}</Text>
                <Text numberOfLines={1} style={styles.meta}>{court.area} - {court.indoor ? 'Indoor' : 'Outdoor'}</Text>
              </View>
              {selectedCourtId === court.id ? <MaterialCommunityIcons name="check-circle" size={22} color={colors.primary} /> : null}
            </Pressable>
          ))}
          <PremiumButton label="Continue to players" icon="arrow-right" onPress={() => setStep(1)} />
        </View>
      ) : null}

      {step === 1 ? (
        <View style={styles.wizardPanel}>
          <Text style={styles.cardTitle}>Build teams</Text>
          <Text style={styles.help}>Tap players to fill Team A first, then Team B.</Text>
          <TextInput value={playerQuery} onChangeText={setPlayerQuery} placeholder="Search players or friends" placeholderTextColor={colors.textSecondary} style={styles.input} />
          <Pressable onPress={() => setFriendsOnly((value) => !value)} style={({ pressed }) => [styles.friendToggle, friendsOnly && styles.selected, pressed && styles.pressed]}>
            <Text style={styles.friendToggleText}>{friendsOnly ? 'Showing friends only' : 'Show friends only'}</Text>
          </Pressable>
          {players
            .filter((player) => !friendsOnly || friendIds.includes(player.id) || player.id === currentUser.id)
            .filter((player) => `${player.name} ${player.username}`.toLowerCase().includes(playerQuery.trim().toLowerCase()))
            .slice(0, 12)
            .map((player) => {
            const picked = teamA.includes(player.id) || teamB.includes(player.id);
            const team = teamA.includes(player.id) ? 'Team A' : teamB.includes(player.id) ? 'Team B' : '';
            return (
              <Pressable key={player.id} onPress={() => togglePlayer(player.id)} style={({ pressed }) => [styles.playerRow, picked && styles.selected, pressed && styles.pressed]}>
                <PlayerAvatar name={player.name} uri={player.avatar} size={42} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text numberOfLines={1} style={styles.cardTitle}>{player.name}</Text>
                  <Text numberOfLines={1} style={styles.meta}>{player.level} - rating {player.rating}</Text>
                </View>
                {team ? <Text style={styles.teamBadge}>{team}</Text> : null}
              </Pressable>
            );
          })}
          <View style={styles.actions}>
            <PremiumButton label="Back" variant="subtle" icon="arrow-left" onPress={() => setStep(0)} style={{ flex: 1 }} />
            <PremiumButton label="Continue to score" icon="arrow-right" onPress={() => setStep(2)} style={{ flex: 1 }} />
          </View>
        </View>
      ) : null}

      {step === 2 ? (
        <View style={styles.wizardPanel}>
          <Text style={styles.cardTitle}>Final score</Text>
          <TextInput value={score} onChangeText={setScore} placeholder="6-4, 6-3" style={styles.input} />
          <View style={styles.actions}>
            <PremiumButton label="Back" variant="subtle" icon="arrow-left" onPress={() => setStep(1)} style={{ flex: 1 }} />
            <PremiumButton label="Continue to proof" icon="camera-outline" onPress={() => setStep(3)} style={{ flex: 1 }} />
          </View>
        </View>
      ) : null}

      {step === 3 ? (
        <View style={styles.stack}>
          <View style={styles.panel}>
            <Text style={styles.cardTitle}>Proof photo</Text>
            {proofUri ? <ImageWithFallback uri={proofUri} style={styles.proofImage} label="Match proof" /> : null}
            <Text style={styles.meta}>{proofMessage}</Text>
            <View style={styles.actions}>
              <PremiumButton label="Attach photo" icon="image-outline" variant="secondary" onPress={pickProof} style={{ flex: 1 }} />
              <PremiumButton label="Take photo" icon="camera-outline" variant="subtle" onPress={takeProof} style={{ flex: 1 }} />
            </View>
            {proofUri ? <PremiumButton label="Remove proof" icon="close" variant="danger" onPress={() => { setProofUri(undefined); setProofMessage('Proof removed. Attach another photo before submitting.'); }} /> : null}
          </View>
          <View style={styles.panel}>
            <Text style={styles.cardTitle}>GPS verification</Text>
            <Text style={styles.meta}>GPS check preview: near {selectedCourt.name}, {selectedCourt.area}.</Text>
          </View>
          <View style={styles.panel}>
            <Text style={styles.cardTitle}>Review</Text>
            <Text style={styles.meta}>Court: {selectedCourt.name}</Text>
            <Text style={styles.meta}>Score: {score}</Text>
            <Text style={styles.meta}>Team A: {teamA.map((id) => players.find((player) => player.id === id)?.name).join(', ')}</Text>
            <Text style={styles.meta}>Team B: {teamB.map((id) => players.find((player) => player.id === id)?.name).join(', ')}</Text>
          </View>
          <View style={styles.actions}>
            <PremiumButton label="Back" variant="subtle" icon="arrow-left" onPress={() => setStep(2)} style={{ flex: 1 }} />
            <PremiumButton label="Submit match" icon="check-decagram-outline" onPress={submitMatch} style={{ flex: 1 }} />
          </View>
        </View>
      ) : null}
      {pendingMatches.length ? (
      <View style={styles.wizardPanel}>
        <Text style={styles.cardTitle}>Pending Results</Text>
        <View style={styles.stack}>
          {pendingMatches.map((match) => (
            <MatchCard key={match.id} match={match} court={courts.find((court) => court.id === match.courtId) || courts[0]} players={players} onConfirm={() => updateMatchStatus(match.id, 'Verified')} onDispute={() => updateMatchStatus(match.id, 'Disputed')} />
          ))}
        </View>
      </View>
      ) : null}

      <ActionSheet visible={done} title="Match pending confirmation" subtitle="Both sides can confirm or dispute before rating is finalized." onClose={() => setDone(false)}>
        <PremiumButton label="View pending matches" icon="clipboard-list-outline" onPress={() => setDone(false)} />
      </ActionSheet>
    </ScrollView>
    </ScreenTransitionWrapper>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { ...centeredContent, padding: spacing.md, gap: 20, paddingBottom: 104 },
  kicker: { color: colors.hotPink, fontWeight: '900', textTransform: 'uppercase', fontSize: 12 },
  title: { color: colors.textPrimary, fontSize: 34, fontWeight: '900', marginTop: 3 },
  progress: { flexDirection: 'row', gap: 8 },
  step: { flex: 1, height: 9, borderRadius: 99, backgroundColor: colors.divider },
  stepActive: { backgroundColor: colors.hotPink },
  pressed: { transform: [{ scale: 0.985 }, { translateY: 1 }] },
  stepText: { opacity: 0, fontSize: 1 },
  stepTextActive: { opacity: 0 },
  stepLabel: { color: colors.textPrimary, fontWeight: '900', fontSize: 20 },
  stepHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  stack: { gap: 10 },
  wizardPanel: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 10 },
  court: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 10 },
  selected: { borderColor: colors.hotPink, backgroundColor: colors.softMaroon },
  courtImage: { width: 78, height: 62, borderRadius: radius.md },
  cardTitle: { color: colors.textPrimary, fontWeight: '900', fontSize: 16 },
  meta: { color: colors.textSecondary, fontWeight: '700', marginTop: 3, lineHeight: 19 },
  help: { color: colors.textSecondary, fontWeight: '700' },
  friendToggle: { alignSelf: 'flex-start', paddingHorizontal: 13, paddingVertical: 9, borderRadius: radius.pill, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.border },
  friendToggleText: { color: colors.pearl, fontWeight: '900' },
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 12 },
  teamBadge: { overflow: 'hidden', backgroundColor: colors.softMaroon, color: colors.pearl, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 5, fontWeight: '900', fontSize: 11 },
  panel: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 8 },
  actions: { flexDirection: 'row', gap: 8 },
  input: { minHeight: 50, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 12, color: colors.textPrimary, fontWeight: '800', backgroundColor: colors.glass },
  proofImage: { width: '100%', height: 160, borderRadius: radius.md },
});
