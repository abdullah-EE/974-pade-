import React, { useEffect, useMemo } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';

const DEMO_KEY = '974early';
const DEMO_STORAGE_KEY = '974-padel-demo-access';
const demoIframeStyle = {
  width: '100%',
  height: '100%',
  border: 0,
  backgroundColor: colors.deep,
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getWebSearchKey() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return undefined;
  return new URLSearchParams(window.location.search).get('key') ?? undefined;
}

export default function DemoRoute() {
  const { width, height } = useWindowDimensions();
  const params = useLocalSearchParams<{ key?: string | string[] }>();
  const desktop = width >= 900;
  const routeKey = firstParam(params.key);
  const webKey = getWebSearchKey();
  const hasAccess = (webKey ?? routeKey) === DEMO_KEY;
  const demoFrameSrc = useMemo(() => `/courts?demo=1&key=${DEMO_KEY}`, []);
  const pagePadding = desktop ? 18 : 8;
  const backButtonSpace = 56;
  const availableFrameWidth = Math.max(300, width - pagePadding * 2);
  const availableFrameHeight = Math.max(420, height - pagePadding * 2 - backButtonSpace);
  const frameWidth = Math.min(430, availableFrameWidth, availableFrameHeight * 0.48);
  const frameHeight = Math.min(availableFrameHeight, frameWidth / 0.48);

  useEffect(() => {
    if (!hasAccess || Platform.OS !== 'web' || typeof window === 'undefined') return;
    window.sessionStorage.setItem(DEMO_STORAGE_KEY, 'true');
  }, [hasAccess]);

  return (
    <View style={[styles.demoPage, desktop && styles.demoPageDesktop]}>
      {hasAccess ? (
        <>
          <Pressable onPress={() => router.replace('/')} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <Text style={styles.backButtonText}>Back to waitlist</Text>
          </Pressable>
          <View style={[styles.phoneFrame, { width: frameWidth, height: frameHeight }]}>
            {React.createElement('iframe' as any, {
              src: demoFrameSrc,
              title: '974 Padel private demo',
              style: demoIframeStyle,
            })}
          </View>
        </>
      ) : (
        <View style={styles.privatePanel}>
          <Text style={styles.privateTitle}>Private demo preview. Please request access.</Text>
          <Pressable onPress={() => router.replace('/')} style={({ pressed }) => [styles.waitlist, pressed && styles.pressed]}>
            <Text style={styles.waitlistText}>Back to waitlist</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  demoPage: { flex: 1, minHeight: '100%' as any, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 8, gap: 10 },
  demoPageDesktop: { padding: 18 },
  phoneFrame: { backgroundColor: colors.deep, overflow: 'hidden', borderRadius: 30, borderWidth: 1, borderColor: colors.border, shadowColor: '#000000', shadowOpacity: 0.3, shadowRadius: 24, shadowOffset: { width: 0, height: 16 } },
  backButton: { minHeight: 42, borderRadius: radius.pill, backgroundColor: colors.pearl, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, borderWidth: 1, borderColor: colors.border },
  backButtonText: { color: colors.deep, fontWeight: '900' },
  privatePanel: { width: '100%', maxWidth: 460, backgroundColor: colors.deep, borderRadius: 28, borderWidth: 1, borderColor: colors.border, padding: spacing.xl, gap: 18, alignItems: 'center' },
  privateTitle: { color: colors.pearl, fontWeight: '900', fontSize: 22, lineHeight: 28, textAlign: 'center' },
  waitlist: { maxWidth: 260, minHeight: 50, borderRadius: radius.pill, backgroundColor: colors.hotPink, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, shadowColor: colors.hotPink, shadowOpacity: 0.35, shadowRadius: 18, shadowOffset: { width: 0, height: 10 } },
  waitlistText: { color: colors.deep, fontWeight: '900' },
  pressed: { transform: [{ scale: 0.97 }, { translateY: 1 }] },
});
