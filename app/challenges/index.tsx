import { ScrollView, StyleSheet, Text } from 'react-native';
import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { challenges, players } from '@/data/mockData';
import { colors, spacing } from '@/theme/tokens';

export default function Challenges(){return <ScrollView style={styles.s} contentContainerStyle={{padding:spacing.lg}}><Text style={styles.t}>Challenges</Text>{challenges.map(c=>{const from=players.find(p=>p.id===c.from)?.name;const to=players.find(p=>p.id===c.to)?.name;return <AppCard key={c.id}><Text style={styles.m}>{from} vs {to}</Text><Text style={styles.m}>Status: {c.status} • {c.date}</Text>{c.status==='Incoming'?<><AppButton label='Accept'/><Text style={{height:8}}/><AppButton label='Decline' variant='secondary'/></>:null}</AppCard>})}</ScrollView>}
const styles=StyleSheet.create({s:{flex:1,backgroundColor:colors.background},t:{color:colors.text,fontSize:28,fontWeight:'800'},m:{color:colors.text,marginBottom:6}})
