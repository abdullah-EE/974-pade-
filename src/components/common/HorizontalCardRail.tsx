import { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { spacing } from '@/theme/tokens';

export function HorizontalCardRail({ children }: { children: ReactNode }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rail: { gap: 12, paddingRight: spacing.md },
});
