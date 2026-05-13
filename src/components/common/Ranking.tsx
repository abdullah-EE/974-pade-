import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Player } from '@/types/models';
import { colors, radius, shadow } from '@/theme/tokens';
import { PlayerAvatar } from './PlayerAvatar';

export function RankingPodium({ players, onOpen }: { players: Player[]; onOpen: (id: string) => void }) {
  return (
    <View style={styles.podium}>
      {players.slice(0, 3).map((player, index) => (
        <Pressable key={player.id} onPress={() => onOpen(player.id)} style={({ pressed }) => [styles.podiumCard, index === 0 && styles.podiumFirst, pressed && styles.pressed]}>
          <Text style={styles.rank}>#{player.rank}</Text>
          <PlayerAvatar name={player.name} uri={player.avatar} size={62} />
          <Text numberOfLines={2} style={styles.name}>{player.name}</Text>
          <Text style={styles.rating}>{player.rating}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function RankingRow({ player, onOpen, isFriend, onFriendToggle }: { player: Player; onOpen: () => void; isFriend?: boolean; onFriendToggle?: () => void }) {
  const up = player.movement >= 0;
  return (
    <Pressable onPress={onOpen} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <Text style={styles.rankSmall}>#{player.rank}</Text>
      <PlayerAvatar name={player.name} uri={player.avatar} size={40} />
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={styles.rowName}>{player.name}</Text>
        <Text style={styles.rowMeta}>{player.username} - {player.level}</Text>
      </View>
      <Text style={styles.rowRating}>{player.rating}</Text>
      <View style={styles.move}>
        <MaterialCommunityIcons name={up ? 'arrow-up' : 'arrow-down'} size={14} color={up ? colors.success : colors.danger} />
        <Text style={[styles.moveText, { color: up ? colors.success : colors.danger }]}>{Math.abs(player.movement)}</Text>
      </View>
      {player.verified ? <MaterialCommunityIcons name="check-decagram" size={18} color={colors.primary} /> : null}
      {isFriend ? <Text style={styles.friendLabel}>Friend</Text> : null}
      {onFriendToggle ? (
        <Pressable onPress={onFriendToggle} style={({ pressed }) => [styles.friend, !isFriend && styles.friendOpen, pressed && styles.friendPressed]}>
          <MaterialCommunityIcons name={isFriend ? 'account-check' : 'account-plus-outline'} size={17} color={isFriend ? '#FFFFFF' : colors.primary} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  podium: { flexDirection: 'row', gap: 10 },
  podiumCard: { flex: 1, minHeight: 174, backgroundColor: '#FFFFFF', borderRadius: radius.lg, padding: 12, alignItems: 'center', gap: 7, borderWidth: 1, borderColor: colors.border, ...shadow },
  podiumFirst: { borderColor: colors.primary, borderWidth: 2 },
  pressed: { transform: [{ scale: 0.982 }, { translateY: 1 }], shadowOpacity: 0.04 },
  rank: { overflow: 'hidden', backgroundColor: colors.softMaroon, color: colors.primary, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5, fontWeight: '900' },
  name: { color: colors.textPrimary, fontWeight: '900', textAlign: 'center', minHeight: 34 },
  rating: { color: colors.textSecondary, fontWeight: '900' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFFFF', borderRadius: radius.md, padding: 12, borderWidth: 1, borderColor: colors.border },
  rankSmall: { width: 34, color: colors.textSecondary, fontWeight: '900' },
  rowName: { color: colors.textPrimary, fontWeight: '900' },
  rowMeta: { color: colors.textSecondary, fontWeight: '700', fontSize: 12, marginTop: 2 },
  rowRating: { width: 54, textAlign: 'right', color: colors.textPrimary, fontWeight: '900' },
  move: { flexDirection: 'row', alignItems: 'center', width: 34 },
  moveText: { fontWeight: '900', fontSize: 12 },
  friend: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  friendOpen: { backgroundColor: colors.softMaroon },
  friendPressed: { transform: [{ scale: 0.9 }] },
  friendLabel: { overflow: 'hidden', backgroundColor: colors.courtSoft, color: colors.court, borderRadius: radius.pill, paddingHorizontal: 7, paddingVertical: 4, fontSize: 10, fontWeight: '900' },
});
