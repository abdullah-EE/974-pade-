import { useEffect, useState } from 'react';
import { Stack, router, useLocalSearchParams, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { OnboardingGate } from '@/components/common/OnboardingGate';
import { AppStateProvider } from '@/state/AppState';
import { colors, radius, spacing } from '@/theme/tokens';

const DEMO_KEY = '974early';
const DEMO_STORAGE_KEY = '974-padel-demo-access';

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getWebSearchKey() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return undefined;
  return new URLSearchParams(window.location.search).get('key') ?? undefined;
}

export default function RootLayout() {
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const params = useLocalSearchParams();
  const [storedDemoAccess, setStoredDemoAccess] = useState(false);
  const showInvestorShell = Platform.OS === 'web';
  const desktop = width >= 900;
  const key = getWebSearchKey() ?? firstParam(params.key);
  const isDemoPage = pathname === '/demo';
  const hasKeyAccess = key === DEMO_KEY;
  const isDemoAppRoute = showInvestorShell && !isDemoPage && pathname !== '/' && (hasKeyAccess || storedDemoAccess);
  const appStack = (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="demo" />
      </Stack>
      <OnboardingGate />
    </>
  );

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    try {
      if (hasKeyAccess) {
        window.sessionStorage.setItem(DEMO_STORAGE_KEY, 'true');
        setStoredDemoAccess(true);
        return;
      }

      setStoredDemoAccess(window.sessionStorage.getItem(DEMO_STORAGE_KEY) === 'true');
    } catch {
      setStoredDemoAccess(false);
    }
  }, [hasKeyAccess, pathname]);

  if (!showInvestorShell) {
    return <AppStateProvider>{appStack}</AppStateProvider>;
  }

  if (isDemoAppRoute) {
    return <AppStateProvider>{appStack}</AppStateProvider>;
  }

  if (isDemoPage) {
    return (
      <AppStateProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="demo" />
        </Stack>
      </AppStateProvider>
    );
  }

  return (
    <AppStateProvider>
      <View style={[styles.webShell, desktop && styles.webShellDesktop]}>
        <View style={[styles.investorPanel, styles.investorPanelLanding, !desktop && styles.investorPanelMobile]}>
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
      </View>
    </AppStateProvider>
  );
}

const styles = StyleSheet.create({
  webShell: { flex: 1, backgroundColor: colors.background },
  webShellDesktop: { justifyContent: 'center', alignItems: 'center', padding: 28 },
  investorPanel: { padding: spacing.xl, gap: 16, backgroundColor: colors.deep },
  investorPanelLanding: { width: '100%', maxWidth: 760, borderRadius: Platform.OS === 'web' ? 28 : 0, borderWidth: Platform.OS === 'web' ? 1 : 0, borderColor: colors.border },
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
});
