import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ImageWithFallback } from './ImageWithFallback';
export function HeroCarousel({images}:{images:string[]}){return <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>{images.map((u,i)=><View key={i} style={s.slide}><ImageWithFallback uri={u} style={s.img} label='974 Padel'/><View style={s.o}/><Text style={s.t}>Find a padel court in Qatar</Text></View>)}</ScrollView>}
const s=StyleSheet.create({slide:{width:340,height:210,borderRadius:18,overflow:'hidden',marginRight:10},img:{width:'100%',height:'100%'},o:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,.3)'},t:{position:'absolute',left:16,bottom:16,color:'white',fontSize:28,fontWeight:'800',maxWidth:280}})
