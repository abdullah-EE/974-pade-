import { ScrollView, StyleSheet, Text } from 'react-native';
import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { challenges, players } from '@/data/mockData';
import { colors, spacing } from '@/theme/tokens';

export default function Challenges() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: spacing.lg }}>
      <Text style={styles.title}>Challenges</Text>
      {challenges.map((challenge) => {
        const from = players.find((player) => player.id === challenge.from)?.name || 'Open player';
        const to = players.find((player) => player.id === challenge.to)?.name || 'Open invite';
        return (
          <AppCard key={challenge.id}>
            <Text style={styles.meta}>{from} vs {to}</Text>
            <Text style={styles.meta}>Status: {challenge.status} - {challenge.date}</Text>
            {challenge.status === 'Incoming' ? (
              <>
                <AppButton label="Accept" />
                <Text style={{ height: 8 }} />
                <AppButton label="Decline" variant="secondary" />
              </>
            ) : null}
          </AppCard>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: '800' },
  meta: { color: colors.textPrimary, marginBottom: 6 },
});
