import { useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { courts } from '@/data/mockData';
import { colors, spacing } from '@/theme/tokens';
import { FilterChips } from '@/components/common/FilterChips';
import { HeroCarousel } from '@/components/common/HeroCarousel';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { PremiumButton } from '@/components/common/PremiumButton';
const filters=['Tonight','Indoor','Outdoor','Lusail','Katara','Msheireb','The Pearl','Aspire'];

export default function Play(){
  const [q,setQ]=useState('');const [f,setF]=useState('');const [sheet,setSheet]=useState('');
  const data=useMemo(()=>courts.filter(c=>c.name.toLowerCase().includes(q.toLowerCase())&&(f===''||(f==='Indoor'&&c.indoor)||(f==='Outdoor'&&!c.indoor)||c.name.includes(f)||c.area===f)),[q,f]);
  return <ScrollView style={styles.s} contentContainerStyle={{padding:spacing.lg}}>
    <HeroCarousel images={courts.slice(0,3).map(c=>c.image)} />
    <TextInput value={q} onChangeText={setQ} placeholder='Search courts or area' placeholderTextColor={colors.muted} style={styles.search}/>
    <FilterChips items={filters} selected={f} onSelect={setF}/>
    <Text style={styles.section}>Available tonight</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>{data.slice(0,6).map(c=><TouchableOpacity key={c.id} style={styles.hCard} onPress={()=>router.push(`/court/${c.id}`)}><ImageWithFallback uri={c.image} style={styles.hImg} label={c.area}/><Text style={styles.name}>{c.name}</Text><Text style={styles.meta}>{c.indoor?'Indoor':'Outdoor'} • 7:00 8:30 10:00</Text></TouchableOpacity>)}</ScrollView>
    <Text style={styles.section}>Top courts this week</Text>
    {data.map(c=><View key={c.id} style={styles.card}><Text style={styles.name}>{c.name}</Text><Text style={styles.meta}>{c.area} • {c.price}</Text><View style={styles.actions}><PremiumButton title='Book externally' onPress={()=>setSheet('External booking placeholder')} /><TouchableOpacity onPress={()=>setSheet('Open ranked match created')} style={styles.ghost}><Text style={styles.ghostT}>Open ranked match</Text></TouchableOpacity></View></View>)}
    <Modal transparent visible={!!sheet} animationType='slide'><TouchableOpacity style={styles.modalBg} onPress={()=>setSheet('')}><View style={styles.sheet}><Text style={styles.sheetT}>{sheet}</Text><Text style={styles.meta}>This action is mocked in frontend only.</Text></View></TouchableOpacity></Modal>
  </ScrollView>
}

const styles=StyleSheet.create({s:{flex:1,backgroundColor:'#090B10'},search:{marginVertical:12,backgroundColor:'#121821',padding:12,borderRadius:12,color:'#fff',borderWidth:1,borderColor:'#242d3d'},section:{color:colors.sand,fontSize:18,fontWeight:'700',marginTop:12,marginBottom:8},hCard:{width:260,marginRight:10},hImg:{height:150,borderRadius:14,width:'100%'},name:{color:'#F1F3F7',fontWeight:'700',fontSize:16,marginTop:8},meta:{color:'#A0AABD',marginTop:2},card:{backgroundColor:'#111722',borderRadius:16,padding:14,marginBottom:10,borderWidth:1,borderColor:'#273247'},actions:{flexDirection:'row',gap:8,marginTop:10,alignItems:'center'},ghost:{borderWidth:1,borderColor:colors.gold,borderRadius:12,paddingVertical:10,paddingHorizontal:12},ghostT:{color:colors.gold,fontWeight:'700'},modalBg:{flex:1,backgroundColor:'rgba(0,0,0,.5)',justifyContent:'flex-end'},sheet:{backgroundColor:'#151c2a',padding:20,borderTopLeftRadius:20,borderTopRightRadius:20},sheetT:{color:'#fff',fontSize:18,fontWeight:'700'}})
