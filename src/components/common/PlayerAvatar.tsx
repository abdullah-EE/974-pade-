import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/theme/tokens';
import { initials } from '@/utils/format';

export function PlayerAvatar({ name, uri, size = 42 }: { name: string; uri?: string; size?: number }) {
  if (!uri) {
    return (
      <LinearGradient colors={['#660033', '#8A1E4D']} style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}>
        <Text style={styles.initials}>{initials(name)}</Text>
      </LinearGradient>
    );
  }
  return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.softMaroon }} contentFit="cover" />;
}

const styles = StyleSheet.create({
  fallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.softMaroon },
  initials: { color: '#FFFFFF', fontWeight: '900', fontSize: 12 },
});
