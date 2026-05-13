import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { OnboardingGate } from '@/components/common/OnboardingGate';
import { AppStateProvider } from '@/state/AppState';

export default function RootLayout() {
  return (
    <AppStateProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <OnboardingGate />
    </AppStateProvider>
  );
}
