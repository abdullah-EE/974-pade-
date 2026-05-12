import { Text, StyleSheet, View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { courts } from '@/data/mock/data';
import { colors } from '@/theme/tokens';

export default function CourtsScreen() {
  return <Screen><Text style={styles.title}>Courts</Text>{courts.map((c) => <View key={c.id} style={styles.card}><Text style={styles.text}>{c.name}</Text><Text style={styles.meta}>{c.area} • {c.indoor ? 'Indoor' : 'Outdoor'}</Text></View>)}</Screen>;
}
const styles = StyleSheet.create({ title: { color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: 12 }, card: { backgroundColor: colors.surface, padding: 12, borderRadius: 12, marginBottom: 8 }, text: { color: colors.text }, meta: { color: colors.muted } });
