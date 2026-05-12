import { useState } from 'react';
import { Image, ImageStyle, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '@/theme/tokens';

export function ImageWithFallback({ uri, style, label='974 Padel' }: { uri: string; style: ImageStyle; label?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <View style={[style as ViewStyle, styles.fallback]}><Text style={styles.text}>{label}</Text></View>;
  return <Image source={{ uri }} style={style} onError={() => setFailed(true)} />;
}

const styles = StyleSheet.create({ fallback: { backgroundColor: '#1A2438', alignItems: 'center', justifyContent: 'center' }, text: { color: colors.sand, fontWeight: '700' } });
