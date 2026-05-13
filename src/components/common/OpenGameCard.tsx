import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Court, OpenGame, Player } from '@/types/models';
import { colors, radius, shadow } from '@/theme/tokens';
import { formatGameTime } from '@/utils/format';
import { PlayerAvatar } from './PlayerAvatar';
import { PremiumButton } from './PremiumButton';

export function OpenGameCard({ game, court, players, onJoin }: { game: OpenGame; court: Court; players: Player[]; onJoin: () => void }) {
  const [hovered, setHovered] = useState(false);
  const gamePlayers = game.playerIds.map((id) => players.find((player) => player.id === id)).filter(Boolean) as Player[];
  const host = players.find((player) => player.id === game.hostId) || gamePlayers[0];
  const spotsLeft = Math.max(0, game.capacity - game.playerIds.length - (game.joined ? 1 : 0));
  return (
    <Pressable onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)} style={({ pressed }) => [styles.card, hovered && !pressed && styles.hovered, pressed && styles.pressed]}>
      <Text numberOfLines={1} style={styles.court}>{court.name}</Text>
      <Text style={styles.time}>{formatGameTime(game.startsAt)}</Text>
      <View style={styles.meta}>
        <Text style={styles.pill}>{game.level}</Text>
        {game.privacy ? <Text style={styles.privacy}>{game.privacy}</Text> : null}
        <Text style={styles.spots}>{game.joined ? 'Joined' : `${spotsLeft} spots left`}</Text>
      </View>
      <View style={styles.host}>
        <PlayerAvatar name={host?.name || 'Host'} uri={host?.avatar} size={38} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.hostLabel}>Hosted by</Text>
          <Text numberOfLines={1} style={styles.hostName}>{host?.name}</Text>
        </View>
      </View>
      <PremiumButton label={game.joined ? 'Joined' : 'Join'} icon={game.joined ? 'check' : 'account-plus-outline'} variant={game.joined ? 'subtle' : 'primary'} onPress={onJoin} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: 234, backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.border, gap: 9, ...shadow, cursor: 'pointer' } as any,
  hovered: { transform: [{ translateY: -4 }, { scale: 1.018 }], shadowOpacity: 0.17, shadowRadius: 22, shadowOffset: { width: 0, height: 13 }, elevation: 8 },
  pressed: { transform: [{ scale: 0.975 }, { translateY: 1 }], shadowOpacity: 0.04 },
  court: { color: colors.textPrimary, fontSize: 16, fontWeight: '900' },
  time: { color: colors.textSecondary, fontWeight: '800' },
  meta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  pill: { overflow: 'hidden', backgroundColor: colors.softMaroon, color: colors.pearl, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 5, fontWeight: '900', fontSize: 11 },
  privacy: { overflow: 'hidden', backgroundColor: colors.darkSection, color: '#FFFFFF', borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 5, fontWeight: '900', fontSize: 10 },
  spots: { color: colors.textSecondary, fontWeight: '800', fontSize: 12 },
  host: { flexDirection: 'row', alignItems: 'center', gap: 9, minHeight: 38 },
  hostLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  hostName: { color: colors.textPrimary, fontWeight: '900', marginTop: 1 },
});
