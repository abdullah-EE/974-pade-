import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MotiView } from 'moti';
import { Player } from '@/types/models';
import { colors, radius, shadow } from '@/theme/tokens';
import { AnimatedNumber } from './AnimatedNumber';
import { PlayerAvatar } from './PlayerAvatar';

export function RankingPodium({ players, onOpen }: { players: Player[]; onOpen: (id: string) => void }) {
  return (
    <View style={styles.podium}>
      {players.slice(0, 3).map((player, index) => (
        <MotiView key={player.id} from={{ opacity: 0, translateY: 16 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 320, delay: index * 80 }} style={{ flex: 1 }}>
        <Pressable onPress={() => onOpen(player.id)} style={({ pressed }) => [styles.podiumCard, index === 0 && styles.podiumFirst, pressed && styles.pressed]}>
          <Text style={styles.rank}>#{player.rank}</Text>
          <PlayerAvatar name={player.name} uri={player.avatar} size={62} />
          <Text numberOfLines={2} style={styles.name}>{player.name}</Text>
          <AnimatedNumber value={player.rating} style={styles.rating} />
        </Pressable>
        </MotiView>
      ))}
    </View>
  );
}

export function RankingRow({ player, onOpen, isFriend, onFriendToggle }: { player: Player; onOpen: () => void; isFriend?: boolean; onFriendToggle?: () => void }) {
  const up = player.movement >= 0;
  return (
    <Pressable onPress={onOpen} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <Text style={styles.rankSmall}>#{player.rank}</Text>
      <PlayerAvatar name={player.name} uri={player.avatar} size={38} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={styles.rowName}>{player.name}</Text>
        <Text numberOfLines={1} style={styles.rowMeta}>{player.username} - {player.level}</Text>
      </View>
      <AnimatedNumber value={player.rating} style={styles.rowRating} />
      <View style={styles.move}>
        <MaterialCommunityIcons name={up ? 'arrow-up' : 'arrow-down'} size={14} color={up ? colors.success : colors.danger} />
        <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 260 }}>
          <Text style={[styles.moveText, { color: up ? colors.success : colors.danger }]}>{Math.abs(player.movement)}</Text>
        </MotiView>
      </View>
      {player.verified ? <MaterialCommunityIcons name="check-decagram" size={18} color={colors.success} /> : null}
      {onFriendToggle ? (
        <Pressable onPress={onFriendToggle} style={({ pressed }) => [styles.friend, !isFriend && styles.friendOpen, pressed && styles.friendPressed]}>
          <MaterialCommunityIcons name={isFriend ? 'account-check' : 'account-plus-outline'} size={17} color={isFriend ? colors.deep : colors.hotPink} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  podium: { flexDirection: 'row', gap: 10 },
  podiumCard: { minHeight: 174, backgroundColor: colors.card, borderRadius: radius.lg, padding: 12, alignItems: 'center', gap: 7, borderWidth: 1, borderColor: colors.border, ...shadow },
  podiumFirst: { borderColor: colors.hotPink, borderWidth: 2, shadowColor: colors.hotPink, shadowOpacity: 0.18 },
  pressed: { transform: [{ scale: 0.982 }, { translateY: 1 }], shadowOpacity: 0.04 },
  rank: { overflow: 'hidden', backgroundColor: colors.softMaroon, color: colors.pearl, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5, fontWeight: '900' },
  name: { color: colors.textPrimary, fontWeight: '900', textAlign: 'center', minHeight: 34 },
  rating: { color: colors.hotPink, fontWeight: '900' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: colors.glass, borderRadius: radius.md, padding: 10, borderWidth: 1, borderColor: colors.border },
  rankSmall: { width: 30, color: colors.textSecondary, fontWeight: '900', fontSize: 12 },
  rowName: { color: colors.textPrimary, fontWeight: '900' },
  rowMeta: { color: colors.textSecondary, fontWeight: '700', fontSize: 12, marginTop: 2 },
  rowRating: { width: 46, textAlign: 'right', color: colors.textPrimary, fontWeight: '900', fontSize: 13 },
  move: { flexDirection: 'row', alignItems: 'center', width: 28 },
  moveText: { fontWeight: '900', fontSize: 12 },
  friend: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.success },
  friendOpen: { backgroundColor: colors.softMaroon },
  friendPressed: { transform: [{ scale: 0.9 }] },
});
