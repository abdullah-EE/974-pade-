import { Text, StyleSheet, View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { matches } from '@/data/mock/data';
import { colors } from '@/theme/tokens';

export default function MatchesScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Matches</Text>
      {matches.map((m) => (
        <View key={m.id} style={styles.card}><Text style={styles.text}>{m.opponent} • {m.score}</Text><Text style={styles.status}>Status: {m.status}</Text></View>
      ))}
    </Screen>
  );
}
const styles = StyleSheet.create({ title: { color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: 12 }, card: { backgroundColor: colors.surface, padding: 12, borderRadius: 12, marginBottom: 8 }, text: { color: colors.text }, status: { color: colors.muted, marginTop: 4 } });
