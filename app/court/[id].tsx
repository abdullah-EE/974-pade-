import { useLocalSearchParams } from 'expo-router';
import { ImageBackground, ScrollView, StyleSheet, Text } from 'react-native';
import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { courts, matches, players } from '@/data/mockData';
import { colors, spacing } from '@/theme/tokens';

export default function CourtDetail(){const {id}=useLocalSearchParams<{id:string}>();const c=courts.find(x=>x.id===id)??courts[0];const recent=matches.filter(m=>m.courtId===c.id).slice(0,3);return <ScrollView style={styles.s} contentContainerStyle={{padding:spacing.lg}}><ImageBackground source={{uri:c.image}} style={styles.hero} imageStyle={{borderRadius:16}}><Text style={styles.h}>{c.name}</Text></ImageBackground><AppCard><Text style={styles.t}>{c.area} • {c.indoor?'Indoor':'Outdoor'} • {c.courts} courts</Text><Text style={styles.t}>Opening: 6:00 AM - 1:00 AM</Text><Text style={styles.t}>Price: {c.price}</Text><Text style={styles.t}>Popular: 7PM - 10PM</Text></AppCard><AppCard><Text style={styles.t}>Players here</Text>{players.slice(0,4).map(p=><Text key={p.id} style={styles.t}>• {p.name}</Text>)}</AppCard><AppCard><Text style={styles.t}>Recent ranked matches</Text>{recent.map(r=><Text key={r.id} style={styles.t}>• {r.score} ({r.status})</Text>)}</AppCard><AppButton label='Submit Match at this Court'/><Text style={{height:8}}/><AppButton label='External Booking (Placeholder)' variant='secondary'/></ScrollView>}
const styles=StyleSheet.create({s:{flex:1,backgroundColor:colors.background},hero:{height:190,justifyContent:'flex-end',padding:16,marginBottom:12},h:{color:'white',fontWeight:'800',fontSize:24},t:{color:colors.text,marginBottom:4}})
