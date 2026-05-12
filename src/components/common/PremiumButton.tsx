import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '@/theme/tokens';

export function PremiumButton({title,onPress}:{title:string;onPress?:()=>void}){return <Pressable onPress={onPress} style={({pressed})=>[styles.btn,pressed&&{opacity:.8,transform:[{scale:.98}]}]}><Text style={styles.t}>{title}</Text></Pressable>}
const styles=StyleSheet.create({btn:{backgroundColor:colors.gold,paddingVertical:10,paddingHorizontal:14,borderRadius:12},t:{color:'#261b07',fontWeight:'700'}})
