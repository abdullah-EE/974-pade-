import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ImageSourcePropType, ImageStyle, StyleProp, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

export function ImageWithFallback({ uri, style, label = '974 Padel' }: { uri?: ImageSourcePropType | string; style: StyleProp<ImageStyle>; label?: string }) {
  const [failed, setFailed] = useState(false);
  const palettes = [
    ['#1A1015', '#365B4A', '#F7F3F0'],
    ['#2B1821', '#0F6B4D', '#F2E6EC'],
    ['#171014', '#623244', '#DCEFE8'],
    ['#3A001D', '#7A5163', '#F7F3F0'],
  ] as const;
  const palette = palettes[label.length % palettes.length];

  if (failed || !uri) {
    return (
      <LinearGradient colors={palette} style={[style, styles.center]}>
        <View style={styles.glassWall} />
        <View style={styles.courtMark}>
          <View style={styles.netLine} />
          <View style={styles.serviceLine} />
          <View style={styles.backGlass} />
        </View>
        <View style={styles.floorGlow} />
        <View style={styles.icon}>
          <MaterialCommunityIcons name="racquetball" size={25} color="#FFFFFF" />
        </View>
        <Text numberOfLines={2} style={styles.text}>{label}</Text>
      </LinearGradient>
    );
  }

  const source = typeof uri === 'string' ? { uri } : uri;
  return <Image source={source} style={style} contentFit="cover" transition={180} onError={() => setFailed(true)} />;
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center', padding: 18, overflow: 'hidden' },
  glassWall: { position: 'absolute', left: 16, right: 16, top: 18, height: '42%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)', backgroundColor: 'rgba(255,255,255,0.08)', transform: [{ perspective: 700 }, { rotateX: '58deg' }] },
  courtMark: { position: 'absolute', left: 18, right: 18, top: 34, bottom: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.32)', borderRadius: 14, transform: [{ perspective: 700 }, { rotateX: '58deg' }] },
  netLine: { position: 'absolute', top: '50%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.32)' },
  serviceLine: { position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, backgroundColor: 'rgba(255,255,255,0.22)' },
  backGlass: { position: 'absolute', left: 0, right: 0, top: '27%', height: 1, backgroundColor: 'rgba(255,255,255,0.22)' },
  floorGlow: { position: 'absolute', left: -20, right: -20, bottom: -18, height: 82, backgroundColor: 'rgba(15,107,77,0.34)', borderRadius: 80 },
  icon: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.16)', marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.20)' },
  text: { color: '#FFFFFF', fontWeight: '900', textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.28)', textShadowRadius: 8 },
});
