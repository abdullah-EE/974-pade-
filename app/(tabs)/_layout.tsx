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
      initialRouteName="courts"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#8F868B',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '800', marginTop: 2 },
        tabBarStyle: {
          backgroundColor: 'rgba(255,253,251,0.94)',
          borderTopColor: '#EFE5E9',
          height: 76,
          paddingBottom: 12,
          paddingTop: 8,
          shadowColor: '#2A1621',
          shadowOpacity: 0.12,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: -6 },
          elevation: 12,
        },
        tabBarBackground: () => <BlurView tint="light" intensity={72} style={StyleSheet.absoluteFill} />,
      }}
    >
      <Tabs.Screen name="courts" options={{ title: 'Play', tabBarIcon: icon('stadium') }} />
      <Tabs.Screen name="leaderboard" options={{ title: 'Rankings', tabBarIcon: icon('podium') }} />
      <Tabs.Screen name="submit" options={{ title: 'Submit', tabBarIcon: icon('clipboard-check-outline') }} />
      <Tabs.Screen name="challenges" options={{ title: 'Challenges', tabBarIcon: icon('sword-cross') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: icon('account-circle-outline') }} />
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}
