import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { courts } from '@/data/mockData';
import { colors, spacing } from '@/theme/tokens';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
const filters=['Available Tonight','Indoor','Outdoor','Lusail','Katara','West Bay','Msheireb','Aspire'];

export default function Courts(){
  const [q,setQ]=useState('');const [f,setF]=useState('');
  const data=useMemo(()=>courts.filter(c=>c.name.toLowerCase().includes(q.toLowerCase())&&(f===''||(f==='Indoor'&&c.indoor)||(f==='Outdoor'&&!c.indoor)||c.name.includes(f)||c.area===f)),[q,f]);
  return <ScrollView style={styles.s} contentContainerStyle={{padding:spacing.lg}}>
    <View style={styles.hero}><ImageWithFallback uri={courts[0].image} style={styles.heroImg} label='Qatar Courts'/><View style={styles.overlay}/><Text style={styles.heroT}>Find a padel court in Qatar tonight</Text></View>
    <TextInput value={q} onChangeText={setQ} placeholder='Search courts, area...' placeholderTextColor={colors.muted} style={styles.in}/>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>{filters.map(x=><TouchableOpacity key={x} onPress={()=>setF(f===x?'':x)} style={[styles.chip,f===x&&styles.active]}><Text style={[styles.chipT,f===x&&styles.activeT]}>{x}</Text></TouchableOpacity>)}</ScrollView>
    <Text style={styles.section}>Featured courts</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>{courts.slice(0,4).map(c=><TouchableOpacity key={c.id} style={styles.featured} onPress={()=>router.push(`/court/${c.id}`)}><ImageWithFallback uri={c.image} style={styles.featureImg} label={c.area}/><View style={styles.overlay}/><Text style={styles.n}>{c.name}</Text></TouchableOpacity>)}</ScrollView>
    <Text style={styles.section}>All courts</Text>
    {data.map(c=><TouchableOpacity key={c.id} style={styles.card} onPress={()=>router.push(`/court/${c.id}`)}><Text style={styles.n}>{c.name}</Text><Text style={styles.meta}>{c.area} • {c.indoor?'Indoor':'Outdoor'} • {c.courts} courts</Text><Text style={styles.meta}>{c.price} {c.ranked?'• Ranked-match venue':''}</Text><View style={styles.btnRow}><TouchableOpacity style={styles.btn}><Text style={styles.btnT}>Book externally</Text></TouchableOpacity><TouchableOpacity style={[styles.btn,styles.btnGhost]}><Text style={[styles.btnT,{color:colors.gold}]}>Start ranked match</Text></TouchableOpacity></View></TouchableOpacity>)}
  </ScrollView>
}

const styles=StyleSheet.create({s:{flex:1,backgroundColor:colors.background},hero:{height:190,marginBottom:12,position:'relative',borderRadius:16,overflow:'hidden'},heroImg:{height:190,width:'100%'},overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,.35)'},heroT:{position:'absolute',left:16,bottom:16,color:'white',fontSize:24,fontWeight:'800'},in:{marginBottom:10,backgroundColor:colors.surface,padding:12,borderRadius:12,color:colors.text,borderWidth:1,borderColor:colors.border},chip:{padding:8,paddingHorizontal:12,marginRight:8,borderRadius:16,backgroundColor:colors.surfaceAlt},active:{backgroundColor:colors.gold},chipT:{color:colors.text,fontSize:12},activeT:{color:'#241b08',fontWeight:'700'},section:{color:colors.sand,fontWeight:'700',marginTop:14,marginBottom:8},featured:{width:220,marginRight:10,height:130,borderRadius:14,overflow:'hidden',justifyContent:'flex-end'},featureImg:{width:'100%',height:130},card:{backgroundColor:colors.card,padding:14,borderRadius:14,marginTop:10,borderWidth:1,borderColor:colors.border},n:{color:colors.text,fontWeight:'700',zIndex:2,padding:8},meta:{color:colors.muted,marginTop:2},btnRow:{flexDirection:'row',gap:8,marginTop:10},btn:{backgroundColor:colors.gold,paddingVertical:8,paddingHorizontal:10,borderRadius:8},btnGhost:{backgroundColor:'transparent',borderWidth:1,borderColor:colors.gold},btnT:{color:'#241b08',fontWeight:'700',fontSize:12}})
