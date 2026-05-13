import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { courts, matches, players } from '@/data/mockData';
import { colors } from '@/theme/tokens';

export default function MatchesScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Matches</Text>
      {matches.map((match) => {
        const teamA = match.teamA.map((id) => players.find((player) => player.id === id)?.name).filter(Boolean).join(' / ');
        const teamB = match.teamB.map((id) => players.find((player) => player.id === id)?.name).filter(Boolean).join(' / ');
        const court = courts.find((item) => item.id === match.courtId)?.name || 'Qatar padel court';
        return (
          <View key={match.id} style={styles.card}>
            <Text style={styles.text}>{teamA} vs {teamB}</Text>
            <Text style={styles.status}>{court} - {match.score} - {match.status}</Text>
          </View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '700', marginBottom: 12 },
  card: { backgroundColor: colors.card, padding: 12, borderRadius: 12, marginBottom: 8 },
  text: { color: colors.textPrimary, fontWeight: '700' },
  status: { color: colors.textSecondary, marginTop: 4 },
});
