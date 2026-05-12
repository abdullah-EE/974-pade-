import { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';
export const AppCard=({children}:{children:ReactNode})=><View style={styles.c}>{children}</View>;
const styles=StyleSheet.create({c:{backgroundColor:colors.card,borderRadius:radius.lg,padding:spacing.lg,marginBottom:spacing.md,borderWidth:1,borderColor:colors.border}});
