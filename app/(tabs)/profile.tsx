import { Text, StyleSheet } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { me, notifications } from '@/data/mock/data';
import { colors } from '@/theme/tokens';

export default function ProfileScreen() {
  return <Screen><Text style={styles.title}>Profile</Text><Card><Text style={styles.text}>{me.name} • {me.region}</Text><Text style={styles.text}>Matches: {me.matchesPlayed}</Text></Card><Card><Text style={styles.text}>Notifications: {notifications.length}</Text></Card></Screen>;
}
const styles = StyleSheet.create({ title: { color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: 12 }, text: { color: colors.text } });
