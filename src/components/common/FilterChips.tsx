import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '@/theme/tokens';
export function FilterChips({items,selected,onSelect}:{items:string[];selected:string;onSelect:(v:string)=>void}){return <ScrollView horizontal showsHorizontalScrollIndicator={false}>{items.map(i=><TouchableOpacity key={i} style={[s.c,selected===i&&s.a]} onPress={()=>onSelect(selected===i?'':i)}><Text style={[s.t,selected===i&&s.at]}>{i}</Text></TouchableOpacity>)}</ScrollView>}
const s=StyleSheet.create({c:{paddingHorizontal:12,paddingVertical:8,backgroundColor:'#1A2233',borderRadius:20,marginRight:8},a:{backgroundColor:colors.gold},t:{color:'#D9DFE8'},at:{color:'#2b1f08',fontWeight:'700'}})
