import { Text, View, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme/tokens';
export const ScreenHeader=({title,subtitle}:{title:string;subtitle?:string})=><View style={{marginBottom:spacing.md}}><Text style={styles.t}>{title}</Text>{subtitle?<Text style={styles.s}>{subtitle}</Text>:null}</View>;
const styles=StyleSheet.create({t:{color:colors.text,fontSize:28,fontWeight:'800'},s:{color:colors.muted,marginTop:4}});
