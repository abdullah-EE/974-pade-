import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { OnboardingGate } from '@/components/common/OnboardingGate';
import { AppStateProvider } from '@/state/AppState';
import { colors, radius, spacing } from '@/theme/tokens';

export default function RootLayout() {
  const { width } = useWindowDimensions();
  const showInvestorShell = Platform.OS === 'web';
  const desktop = width >= 900;
  const appStack = (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <OnboardingGate />
    </>
  );

  return (
    <AppStateProvider>
      {showInvestorShell ? (
        <View style={[styles.webShell, desktop && styles.webShellDesktop]}>
          <View style={[styles.investorPanel, !desktop && styles.investorPanelMobile]}>
            <Text style={styles.eyebrow}>974 Padel Qatar</Text>
            <Text style={styles.heroTitle}>The ranking and network layer for Qatar padel.</Text>
            <Text style={styles.heroCopy}>Find players, organize games, verify results, climb rankings, book externally, discover coaches, and build club competition loops.</Text>
            <View style={styles.loopBox}>
              <Text style={styles.loopTitle}>Product loop</Text>
              <Text style={styles.loopText}>Sign up to find players to challenge to submit proof to confirm result to rank, stats, and credits update.</Text>
            </View>
            <View style={styles.modelGrid}>
              {['Club Pro', 'Tournaments', 'Coach commission', 'Premium players', '974 Credits', 'Partner perks'].map((item) => (
                <Text key={item} style={styles.modelPill}>{item}</Text>
              ))}
            </View>
            <Pressable onPress={() => Linking.openURL('https://tally.so/r/ODdxeg')} style={({ pressed }) => [styles.waitlist, pressed && styles.waitlistPressed]}>
              <Text style={styles.waitlistText}>Join the waitlist</Text>
            </Pressable>
            <Text style={styles.disclaimer}>Backend-ready MVP. Payments, ads, and admin tools are staged after real accounts and verified data.</Text>
          </View>
          <View style={styles.appPreview}>{appStack}</View>
        </View>
      ) : appStack}
    </AppStateProvider>
  );
}

const styles = StyleSheet.create({
  webShell: { flex: 1, backgroundColor: colors.background },
  webShellDesktop: { flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch', gap: 28, padding: 28 },
  investorPanel: { padding: spacing.xl, gap: 16, backgroundColor: colors.deep },
  investorPanelMobile: { paddingTop: 34 },
  eyebrow: { color: colors.hotPink, fontWeight: '900', textTransform: 'uppercase', fontSize: 12 },
  heroTitle: { color: colors.pearl, fontWeight: '900', fontSize: 42, lineHeight: 46, maxWidth: 560 },
  heroCopy: { color: colors.textSecondary, fontWeight: '700', lineHeight: 22, maxWidth: 560 },
  loopBox: { maxWidth: 560, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: 16 },
  loopTitle: { color: colors.pearl, fontWeight: '900', marginBottom: 6 },
  loopText: { color: colors.textSecondary, fontWeight: '800', lineHeight: 20 },
  modelGrid: { maxWidth: 560, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  modelPill: { overflow: 'hidden', color: colors.pearl, backgroundColor: colors.softMaroon, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 7, fontWeight: '900', fontSize: 12 },
  waitlist: { maxWidth: 260, minHeight: 50, borderRadius: radius.pill, backgroundColor: colors.hotPink, alignItems: 'center', justifyContent: 'center', shadowColor: colors.hotPink, shadowOpacity: 0.35, shadowRadius: 18, shadowOffset: { width: 0, height: 10 } },
  waitlistPressed: { transform: [{ scale: 0.97 }, { translateY: 1 }] },
  waitlistText: { color: colors.deep, fontWeight: '900' },
  disclaimer: { color: colors.muted, fontWeight: '700', maxWidth: 520, fontSize: 12, lineHeight: 18 },
  appPreview: { flex: 1, width: '100%', maxWidth: 520, alignSelf: 'center', overflow: 'hidden', borderRadius: Platform.OS === 'web' ? 28 : 0, borderWidth: Platform.OS === 'web' ? 1 : 0, borderColor: colors.border },
});
