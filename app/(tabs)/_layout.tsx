import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { colors } from '@/theme/tokens';

const icon =
  (name: keyof typeof MaterialCommunityIcons.glyphMap) =>
  ({ color, size }: { color: string; size: number }) =>
    <MaterialCommunityIcons name={name} color={color} size={size} />;

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.hotPink,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '800', marginTop: 2 },
        tabBarStyle: {
          backgroundColor: 'rgba(22,7,14,0.94)',
          borderTopColor: colors.border,
          height: 76,
          paddingBottom: 12,
          paddingTop: 8,
          shadowColor: '#000000',
          shadowOpacity: 0.28,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: -6 },
          elevation: 12,
        },
        tabBarBackground: () => <BlurView tint="dark" intensity={72} style={StyleSheet.absoluteFill} />,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: icon('home-variant-outline') }} />
      <Tabs.Screen name="tournaments" options={{ title: 'Tournaments', tabBarIcon: icon('trophy-outline') }} />
      <Tabs.Screen name="leaderboard" options={{ title: 'Rankings', tabBarIcon: icon('podium') }} />
      <Tabs.Screen name="play" options={{ title: 'Play', tabBarIcon: icon('account-group-outline') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: icon('account-circle-outline') }} />
      <Tabs.Screen name="courts" options={{ href: null }} />
      <Tabs.Screen name="submit" options={{ href: null }} />
      <Tabs.Screen name="challenges" options={{ href: null }} />
    </Tabs>
  );
}
