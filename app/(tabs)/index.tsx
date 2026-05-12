import { Text, StyleSheet } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { colors, spacing } from '@/theme/tokens';
import { me, challenges } from '@/data/mock/data';

export default function HomeScreen() {
  return (
    <Screen>
      <Text style={styles.title}>974 Padel</Text>
      <Card><Text style={styles.big}>Rank #{me.rank}</Text><Text style={styles.text}>Movement: +{me.movement} this week • Form {me.form}</Text></Card>
      <Card><Text style={styles.cta}>Submit Match</Text><Text style={styles.text}>Primary action</Text></Card>
      <Card><Text style={styles.text}>Pending challenges: {challenges.length}</Text></Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 28, fontWeight: '700', marginBottom: spacing.md },
  big: { color: colors.primary, fontSize: 24, fontWeight: '700' },
  text: { color: colors.text, marginTop: 6 },
  cta: { color: colors.text, fontSize: 18, fontWeight: '600' }
});
