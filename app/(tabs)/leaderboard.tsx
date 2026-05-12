import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { leaderboard } from '@/data/mock/data';
import { colors } from '@/theme/tokens';

export default function LeaderboardScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList data={leaderboard} scrollEnabled={false} keyExtractor={(i) => i.id} renderItem={({ item }) => (
        <View style={styles.row}><Text style={styles.rank}>#{item.rank}</Text><Text style={styles.name}>{item.name}</Text><Text style={styles.meta}>{item.movement >= 0 ? `+${item.movement}` : item.movement}</Text></View>
      )} />
    </Screen>
  );
}
const styles = StyleSheet.create({ title: { color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: 12 }, row: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1c263a' }, rank: { color: colors.primary, width: 56 }, name: { color: colors.text, flex: 1 }, meta: { color: colors.muted } });
