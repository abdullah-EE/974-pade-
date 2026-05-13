import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Court, Match, Player } from '@/types/models';
import { colors, radius, shadow } from '@/theme/tokens';
import { formatGameTime } from '@/utils/format';
import { PremiumButton } from './PremiumButton';

export function MatchCard({ match, court, players, onConfirm, onDispute }: { match: Match; court: Court; players: Player[]; onConfirm?: () => void; onDispute?: () => void }) {
  const names = [...match.teamA, ...match.teamB].map((id) => players.find((player) => player.id === id)?.name.split(' ')[0]).filter(Boolean).join(' / ');
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={styles.title}>{court.name}</Text>
        <Text style={styles.meta}>{names}</Text>
        <Text style={styles.meta}>{formatGameTime(match.startsAt)} - {match.score}</Text>
      </View>
      <Text style={styles.status}>{match.status}</Text>
      {match.status === 'Pending' && (onConfirm || onDispute) ? (
        <View style={styles.actions}>
          {onConfirm ? <PremiumButton label="Confirm" icon="check" onPress={onConfirm} style={{ flex: 1 }} /> : null}
          {onDispute ? <PremiumButton label="Dispute" variant="subtle" icon="alert-circle-outline" onPress={onDispute} style={{ flex: 1 }} /> : null}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: radius.md, padding: 12, borderWidth: 1, borderColor: colors.border, gap: 8, ...shadow },
  pressed: { transform: [{ scale: 0.985 }, { translateY: 1 }], shadowOpacity: 0.04 },
  title: { color: colors.textPrimary, fontWeight: '900' },
  meta: { color: colors.textSecondary, fontWeight: '700', marginTop: 3 },
  status: { alignSelf: 'flex-start', overflow: 'hidden', backgroundColor: colors.softMaroon, color: colors.primary, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 5, fontWeight: '900', fontSize: 11 },
  actions: { flexDirection: 'row', gap: 8 },
});
