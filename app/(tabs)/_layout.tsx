import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/tokens';

const icon = (name: keyof typeof Ionicons.glyphMap) => ({ color, size }: { color: string; size: number }) => <Ionicons name={name} color={color} size={size} />;

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle:{backgroundColor:'#0B1220',borderTopColor:'#1E2A3F',height:64,paddingBottom:8}, tabBarActiveTintColor:colors.gold, tabBarInactiveTintColor:'#7F8DA4' }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: icon('home') }} />
      <Tabs.Screen name="leaderboard" options={{ title: 'Leaderboard', tabBarIcon: icon('trophy') }} />
      <Tabs.Screen name="submit" options={{ title: 'Submit', tabBarIcon: icon('add-circle') }} />
      <Tabs.Screen name="courts" options={{ title: 'Courts', tabBarIcon: icon('map') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: icon('person') }} />
    </Tabs>
  );
}
