import { Image, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { colors } from '@/theme/tokens';

export function ImageWithFallback({ uri, style }: { uri:string; style:any }) {
  const [error,setError]=useState(false);
  if(error) return <View style={[style,styles.fallback]}><Text style={styles.t}>974 Padel</Text></View>;
  return <Image source={{uri}} style={style} onError={()=>setError(true)} />;
}
const styles=StyleSheet.create({fallback:{backgroundColor:colors.deep,justifyContent:'center',alignItems:'center'},t:{color:'#fff',fontWeight:'700'}});
