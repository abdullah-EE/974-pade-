import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { matches, players } from '@/data/mockData';
import { colors, spacing } from '@/theme/tokens';

export default function PlayerDetail(){const {id}=useLocalSearchParams<{id:string}>();const p=players.find(x=>x.id===id)??players[0];const recent=matches.slice(0,4);return <ScrollView style={styles.s} contentContainerStyle={{padding:spacing.lg}}><Text style={styles.t}>{p.name}</Text><AppCard><Text style={styles.m}>{p.username} • Rank #{p.rank} • {p.rating}</Text><Text style={styles.m}>{p.level} • {p.hand} hand • {p.side}</Text><Text style={styles.m}>Record {p.wins}-{p.losses}</Text><Text style={styles.m}>Badges: {p.verified?'Verified • ':''}Top 100{p.hotStreak?' • Hot Streak':''}</Text></AppCard><AppCard><Text style={styles.m}>Recent Matches</Text>{recent.map(r=><Text key={r.id} style={styles.m}>• {r.score} ({r.status})</Text>)}</AppCard><AppButton label='Challenge Player'/><Text style={{height:8}}/><AppButton label='Compare (Soon)' variant='secondary'/></ScrollView>}
const styles=StyleSheet.create({s:{flex:1,backgroundColor:colors.background},t:{color:colors.text,fontSize:28,fontWeight:'800'},m:{color:colors.text,marginBottom:4}})
