import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MatchCard } from '@/components/common/MatchCard';
import { PremiumButton } from '@/components/common/PremiumButton';
import { SectionHeader } from '@/components/common/SectionHeader';
import { useAppState } from '@/state/AppState';
import { colors, radius, shadow, spacing } from '@/theme/tokens';
import { formatGameTime } from '@/utils/format';

export default function MatchDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { courts, matches, players, updateMatchStatus } = useAppState();
  const match = matches.find((item) => item.id === id) || matches[0];
  const court = courts.find((item) => item.id === match.courtId) || courts[0];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Match Detail</Text>
      <MatchCard match={match} court={court} players={players} />
      <View style={styles.panel}>
        <Text style={styles.label}>Court</Text>
        <Text style={styles.value}>{court.name}</Text>
        <Text style={styles.label}>Time</Text>
        <Text style={styles.value}>{formatGameTime(match.startsAt)}</Text>
        <Text style={styles.label}>Verification</Text>
        <Text style={styles.value}>Score, GPS verification note, and proof photo status attached.</Text>
      </View>
      <SectionHeader title="Result Actions" />
      <View style={styles.actions}>
        <PremiumButton label="Confirm Result" icon="check" onPress={() => updateMatchStatus(match.id, 'Verified')} style={{ flex: 1 }} />
        <PremiumButton label="Dispute Result" variant="secondary" icon="alert-circle-outline" onPress={() => updateMatchStatus(match.id, 'Disputed')} style={{ flex: 1 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: 16 },
  title: { color: colors.textPrimary, fontSize: 30, fontWeight: '900' },
  panel: { backgroundColor: '#FFFFFF', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 6, ...shadow },
  label: { color: colors.textSecondary, fontWeight: '800', fontSize: 12, textTransform: 'uppercase' },
  value: { color: colors.textPrimary, fontWeight: '800', marginBottom: 6 },
  actions: { flexDirection: 'row', gap: 10 },
});
