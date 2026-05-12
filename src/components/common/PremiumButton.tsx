import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';

export function PremiumButton({ label, onPress, secondary=false }: { label:string; onPress:()=>void; secondary?:boolean }) {
  return <Pressable onPress={onPress} style={({pressed})=>[styles.btn, secondary?styles.secondary:styles.primary, pressed&&{opacity:0.8}]}><Text style={[styles.txt, secondary&&{color:colors.primary}]}>{label}</Text></Pressable>;
}
const styles=StyleSheet.create({btn:{paddingVertical:spacing.sm,paddingHorizontal:spacing.md,borderRadius:radius.pill,alignItems:'center'},primary:{backgroundColor:colors.primary},secondary:{backgroundColor:colors.background,borderWidth:1,borderColor:colors.border},txt:{color:'#fff',fontWeight:'700'}});
