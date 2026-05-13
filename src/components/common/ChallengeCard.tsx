import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Challenge, Court, Player } from '@/types/models';
import { colors, radius, shadow } from '@/theme/tokens';
import { formatGameTime } from '@/utils/format';
import { PlayerAvatar } from './PlayerAvatar';
import { PremiumButton } from './PremiumButton';

export function ChallengeCard({ challenge, opponent, court, onAccept, onDecline, onOpen }: { challenge: Challenge; opponent: Player; court: Court; onAccept?: () => void; onDecline?: () => void; onOpen?: () => void }) {
  const actionable = challenge.status === 'Incoming' && Boolean(onAccept && onDecline);
  const accept = onAccept ?? (() => undefined);
  const decline = onDecline ?? (() => undefined);
  return (
    <Pressable onPress={onOpen} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.row}>
        <PlayerAvatar name={opponent.name} uri={opponent.avatar} size={46} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{opponent.name}</Text>
          <Text style={styles.meta}>{court.name}</Text>
          <Text style={styles.meta}>{formatGameTime(challenge.startsAt)} - {challenge.level}</Text>
          {challenge.note ? <Text numberOfLines={1} style={styles.note}>{challenge.note}</Text> : null}
        </View>
        <View style={styles.statusStack}>
          {challenge.privacy ? <Text style={styles.private}>{challenge.privacy}</Text> : null}
          <Text style={styles.status}>{challenge.status}</Text>
        </View>
      </View>
      {actionable ? (
        <View style={styles.actions}>
          <PremiumButton label="Accept" icon="check" onPress={accept} style={{ flex: 1 }} />
          <PremiumButton label="Decline" icon="close" variant="subtle" onPress={decline} style={{ flex: 1 }} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.border, gap: 12, ...shadow },
  pressed: { transform: [{ scale: 0.985 }, { translateY: 1 }], shadowOpacity: 0.04 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  name: { color: colors.textPrimary, fontSize: 16, fontWeight: '900' },
  meta: { color: colors.textSecondary, fontWeight: '700', marginTop: 3 },
  status: { overflow: 'hidden', backgroundColor: colors.softMaroon, color: colors.primary, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 5, fontWeight: '900', fontSize: 11 },
  statusStack: { alignItems: 'flex-end', gap: 5 },
  private: { overflow: 'hidden', backgroundColor: colors.darkSection, color: '#FFFFFF', borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 4, fontWeight: '900', fontSize: 10 },
  note: { color: colors.textPrimary, fontWeight: '800', marginTop: 5 },
  actions: { flexDirection: 'row', gap: 8 },
});
