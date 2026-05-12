import { TextInput, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';
export function SearchBar({ value,onChangeText }:{value:string; onChangeText:(v:string)=>void}){return <TextInput value={value} onChangeText={onChangeText} placeholder='Search courts, area...' placeholderTextColor={colors.textSecondary} style={styles.i}/>}
const styles=StyleSheet.create({i:{backgroundColor:'#fff',borderWidth:1,borderColor:colors.border,borderRadius:radius.pill,paddingHorizontal:spacing.md,paddingVertical:spacing.sm}})
