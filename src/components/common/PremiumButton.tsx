import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';

type Variant='primary'|'secondary'|'subtle'|'danger';
export function PremiumButton({ label, onPress, variant='primary' }: { label:string; onPress:()=>void; variant?:Variant }) {
  return <Pressable onPress={onPress} style={({pressed})=>[styles.base,styles[variant],pressed&&styles.pressed]}><Text style={[styles.text,variant!=='primary'&&{color:colors.primary},variant==='danger'&&{color:'#fff'}]}>{label}</Text></Pressable>;
}
const styles=StyleSheet.create({base:{paddingVertical:spacing.sm,paddingHorizontal:spacing.md,borderRadius:radius.pill,alignItems:'center'},primary:{backgroundColor:colors.primary},secondary:{backgroundColor:'#fff',borderWidth:1,borderColor:colors.primary},subtle:{backgroundColor:'#f0eaed'},danger:{backgroundColor:colors.danger},text:{color:'#fff',fontWeight:'700',fontSize:13},pressed:{opacity:0.82}});
