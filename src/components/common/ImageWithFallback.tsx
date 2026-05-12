import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

export function ImageWithFallback({ uri, style }: { uri: string; style: any }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <LinearGradient colors={['#3A001D', '#8A1E4D']} style={[style, styles.center]}>
        <Text style={styles.t}>974 Padel</Text>
      </LinearGradient>
    );
  }
  return <Image source={uri} style={style} contentFit="cover" transition={180} onError={() => setFailed(true)} />;
}

const styles = StyleSheet.create({ center: { justifyContent: 'center', alignItems: 'center' }, t: { color: '#fff', fontWeight: '700' } });
