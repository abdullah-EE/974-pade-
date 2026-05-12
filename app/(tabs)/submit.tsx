import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { courts } from '@/data/mockData';
import { colors, spacing } from '@/theme/tokens';
const steps=['Choose court','Select players','Enter score','Add proof photo','Review & submit'];
export default function Submit(){const [step,setStep]=useState(0); return <ScrollView style={styles.s} contentContainerStyle={{padding:spacing.lg}}><Text style={styles.t}>Submit Match</Text><Text style={styles.m}>Step {step+1}: {steps[step]}</Text><AppCard><Text style={styles.tx}>{step===0?`Court: ${courts[0].name}`:step===1?'Team A vs Team B selected':step===2?'Score: 6-4 6-3':step===3?'Proof photo placeholder attached':'Review complete. Ready to submit.'}</Text></AppCard><View style={{gap:8}}><AppButton label={step<4?'Next Step':'Submit Result'} onPress={()=>setStep((s)=>Math.min(4,s+1))}/>{step>0?<AppButton label='Back' variant='secondary' onPress={()=>setStep((s)=>Math.max(0,s-1))}/>:null}</View></ScrollView>}
const styles=StyleSheet.create({s:{flex:1,backgroundColor:colors.background},t:{color:colors.text,fontSize:28,fontWeight:'800'},m:{color:colors.sand,marginVertical:10},tx:{color:colors.text}})
