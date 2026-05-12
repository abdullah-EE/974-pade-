import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { courts, matches, players } from '@/data/mockData';
import { colors, spacing } from '@/theme/tokens';

export default function MatchDetail(){const {id}=useLocalSearchParams<{id:string}>();const m=matches.find(x=>x.id===id)??matches[0];const [status,setStatus]=useState(m.status);const a=players.find(p=>p.id===m.playerA)?.name;const b=players.find(p=>p.id===m.playerB)?.name;const court=courts.find(c=>c.id===m.courtId)?.name;return <ScrollView style={styles.s} contentContainerStyle={{padding:spacing.lg}}><Text style={styles.t}>Match Detail</Text><AppCard><Text style={styles.m}>{a} vs {b}</Text><Text style={styles.m}>Score: {m.score}</Text><Text style={styles.m}>Winner: {players.find(p=>p.id===m.winner)?.name}</Text><Text style={styles.m}>Court: {court}</Text><Text style={styles.m}>Date: {m.date}</Text><Text style={styles.m}>Rating Change: {m.ratingDelta}</Text><Text style={styles.m}>Verification: {status}</Text><Text style={styles.m}>Checklist: GPS ✓ Photo ✓ Venue ✓</Text></AppCard><AppButton label='Confirm' onPress={()=>setStatus('Verified')}/><Text style={{height:8}}/><AppButton label='Dispute' variant='secondary' onPress={()=>setStatus('Disputed')}/></ScrollView>}
const styles=StyleSheet.create({s:{flex:1,backgroundColor:colors.background},t:{color:colors.text,fontSize:28,fontWeight:'800'},m:{color:colors.text,marginBottom:4}})
