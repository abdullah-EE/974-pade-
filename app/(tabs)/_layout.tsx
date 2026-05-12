import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
        tabBarInactiveTintColor: '#8f868b',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#efe5e9',
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
          shadowColor: '#2a1621',
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
      }}
    >
      <Tabs.Screen name="courts" options={{ title: 'Play', tabBarIcon: icon('tennis') }} />
      <Tabs.Screen name="leaderboard" options={{ title: 'Rankings', tabBarIcon: icon('podium') }} />
      <Tabs.Screen name="submit" options={{ title: 'Submit', tabBarIcon: icon('plus-circle-outline') }} />
      <Tabs.Screen name="challenges" options={{ title: 'Challenges', tabBarIcon: icon('lightning-bolt-outline') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: icon('account-outline') }} />
      <Tabs.Screen name="matches" options={{ href: null }} />
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}
