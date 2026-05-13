import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { CollapsibleSection } from '@/components/common/CollapsibleSection';
import { FilterChips } from '@/components/common/FilterChips';
import { RankingPodium, RankingRow } from '@/components/common/Ranking';
import { HorizontalCardRail } from '@/components/common/HorizontalCardRail';
import { useAppState } from '@/state/AppState';
import { colors, radius, spacing } from '@/theme/tokens';
import { centeredContent } from '@/theme/layout';

const filters = ['Overall', 'This Week', 'Friends', 'Club', 'Beginner', 'Intermediate', 'Advanced'];

export default function RankingsScreen() {
  const [filter, setFilter] = useState('Overall');
  const [query, setQuery] = useState('');
  const { players, currentUser, friendIds, addFriend, removeFriend } = useAppState();
  const ranked = useMemo(() => {
    const list = [...players];
    const filtered = list.filter((player) => `${player.name} ${player.username} ${player.club}`.toLowerCase().includes(query.trim().toLowerCase()));
    if (filter === 'This Week') return filtered.sort((a, b) => b.movement - a.movement);
    if (filter === 'Friends') return filtered.filter((player) => friendIds.includes(player.id) || player.id === currentUser.id);
    if (filter === 'Club') return filtered.filter((player) => player.club === currentUser.club);
    if (filter === 'Beginner' || filter === 'Intermediate' || filter === 'Advanced') return filtered.filter((player) => player.level === filter);
    return filtered.sort((a, b) => a.rank - b.rank);
  }, [currentUser.club, currentUser.id, filter, friendIds, players, query]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View>
        <Text style={styles.kicker}>Verified Qatar leaderboard</Text>
        <Text style={styles.title}>Rankings</Text>
      </View>
      <CollapsibleSection title="Top 3 Podium" action="Verified leaders" defaultOpen>
        <RankingPodium players={players.slice(0, 3)} onOpen={(id) => router.push(`/player/${id}`)} />
      </CollapsibleSection>
      <TextInput value={query} onChangeText={setQuery} placeholder="Search players by name, handle, or club" placeholderTextColor={colors.textSecondary} style={styles.search} />
      <CollapsibleSection title="Weekly Movers" action="Fastest climbs">
        <HorizontalCardRail>
          {[...players].sort((a, b) => b.movement - a.movement).slice(0, 6).map((player) => (
            <View key={player.id} style={styles.mover}>
              <Text numberOfLines={1} style={styles.moverName}>{player.name}</Text>
              <Text style={styles.moverMeta}>+{Math.max(0, player.movement)} places</Text>
            </View>
          ))}
        </HorizontalCardRail>
      </CollapsibleSection>
      <FilterChips items={filters} active={filter} onChange={setFilter} />
      <CollapsibleSection title={filter === 'Friends' ? 'Friends Ranking' : filter === 'Club' ? 'Club Ranking' : 'Top 100'} action={filter} defaultOpen>
        <View style={styles.rows}>
          {ranked.map((player) => (
            <RankingRow
              key={player.id}
              player={player}
              isFriend={friendIds.includes(player.id)}
              onFriendToggle={() => (friendIds.includes(player.id) ? removeFriend(player.id) : addFriend(player.id))}
              onOpen={() => router.push(`/player/${player.id}`)}
            />
          ))}
        </View>
      </CollapsibleSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { ...centeredContent, padding: spacing.md, gap: 22, paddingBottom: 104 },
  kicker: { color: colors.primary, fontWeight: '900', textTransform: 'uppercase', fontSize: 12 },
  title: { color: colors.textPrimary, fontSize: 34, fontWeight: '900', marginTop: 3 },
  search: { minHeight: 50, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: 16, color: colors.textPrimary, fontWeight: '800' },
  movers: { gap: 10, paddingRight: spacing.md },
  mover: { width: 154, backgroundColor: colors.darkSection, borderRadius: 16, padding: 14 },
  moverName: { color: '#FFFFFF', fontWeight: '900' },
  moverMeta: { color: '#F2DCE7', marginTop: 6, fontWeight: '800' },
  rows: { gap: 9 },
});
