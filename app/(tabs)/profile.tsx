import { ScrollView, StyleSheet, Text } from 'react-native';
import { AppCard } from '@/components/common/AppCard';
import { AppButton } from '@/components/common/AppButton';
import { challenges, matches, players } from '@/data/mockData';
import { colors, spacing } from '@/theme/tokens';

export default function Profile(){const me=players[6];return <ScrollView style={styles.s} contentContainerStyle={{padding:spacing.lg}}><Text style={styles.t}>Profile</Text><AppCard><Text style={styles.n}>{me.name}</Text><Text style={styles.m}>#{me.rank} • {me.rating} rating • {me.level}</Text><AppButton label='Edit Profile' /></AppCard><AppCard><Text style={styles.m}>My matches: {matches.length}</Text><Text style={styles.m}>My challenges: {challenges.length}</Text><Text style={styles.m}>Favorite courts: 4</Text></AppCard><AppCard><Text style={styles.m}>Rating Progress: +38 this month</Text></AppCard><AppCard><Text style={styles.m}>Settings: Notifications, Privacy, Language (placeholders)</Text></AppCard></ScrollView>}
const styles=StyleSheet.create({s:{flex:1,backgroundColor:colors.background},t:{color:colors.text,fontSize:28,fontWeight:'800'},n:{color:colors.text,fontSize:20,fontWeight:'700',marginBottom:6},m:{color:colors.muted,marginBottom:6}})
