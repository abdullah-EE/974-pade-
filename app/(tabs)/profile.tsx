import { ScrollView, Text, View } from 'react-native';
import { matches, players } from '@/data/mockData';
import { colors } from '@/theme/tokens';

export default function Profile() {
  const me = players[0];
  const winRate = Math.round((me.wins / Math.max(1, me.wins + me.losses)) * 100);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F7F3F0' }}>
      <View style={{ backgroundColor: colors.primary, padding: 18 }}>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800' }}>{me.name}</Text>
        <Text style={{ color: '#f4dfe9' }}>Rank #{me.rank} - Rating {me.rating}</Text>
      </View>
      <View style={{ padding: 16 }}>
        <Text>Record {me.wins}-{me.losses}</Text>
        <Text>Win rate {winRate}%</Text>
        <Text style={{ marginTop: 10, fontWeight: '700' }}>Recent Matches</Text>
        {matches.slice(0, 4).map((match) => (
          <Text key={match.id}>{match.score} - {match.status}</Text>
        ))}
      </View>
    </ScrollView>
  );
}
