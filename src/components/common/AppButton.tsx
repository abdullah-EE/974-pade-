import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';

export function AppButton({ label, onPress, variant='primary' }: { label:string; onPress?:()=>void; variant?:'primary'|'secondary' }) {
  return <Pressable onPress={onPress} style={[styles.btn, variant==='secondary'&&styles.secondary]}><Text style={[styles.txt, variant==='secondary'&&styles.txtSec]}>{label}</Text></Pressable>;
}
const styles = StyleSheet.create({ btn:{backgroundColor:colors.gold,padding:spacing.md,borderRadius:radius.md,alignItems:'center'}, secondary:{backgroundColor:'transparent',borderWidth:1,borderColor:colors.gold}, txt:{color:'#1B1507',fontWeight:'700'}, txtSec:{color:colors.gold} });
