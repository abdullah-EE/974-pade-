import { useEffect, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Court } from '@/types/models';
import { colors, radius } from '@/theme/tokens';
import { appLayout } from '@/theme/layout';
import { ImageWithFallback } from './ImageWithFallback';

const heroCopy = [
  {
    kicker: 'Court discovery',
    title: 'Find a padel court in Qatar',
    subtitle: 'Book through clubs, find players, and enter official events.',
  },
  {
    kicker: 'Player network',
    title: 'Find rivals ready tonight',
    subtitle: 'Search players, message first, and create friendly games at your level.',
  },
  {
    kicker: 'Verified ranking',
    title: 'Climb through official events',
    subtitle: 'Verified tournaments and approved club events are the only ranking source.',
  },
  {
    kicker: 'Coaching and clips',
    title: 'Train smarter between matches',
    subtitle: 'Find coach picks, watch local highlights, and build your Qatar padel profile.',
  },
];

export function HeroCarousel({ courts }: { courts: Court[] }) {
  const ref = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const [active, setActive] = useState(0);
  const slides = courts.slice(0, 4);
  const slideWidth = Math.min(width - 28, appLayout.maxWidth - 28);
  const slideHeight = Math.min(392, Math.max(304, slideWidth * 0.56));

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (active + 1) % slides.length;
      ref.current?.scrollTo({ x: next * slideWidth, animated: true });
      setActive(next);
    }, 3800);
    return () => clearInterval(timer);
  }, [active, slides.length]);

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setActive(Math.round(event.nativeEvent.contentOffset.x / slideWidth));
  };

  return (
    <View>
      <ScrollView ref={ref} horizontal pagingEnabled snapToInterval={slideWidth} decelerationRate="fast" showsHorizontalScrollIndicator={false} onMomentumScrollEnd={onScrollEnd}>
        {slides.map((court, index) => {
          const copy = heroCopy[index % heroCopy.length];
          return (
          <View key={court.id} style={[styles.slide, { width: slideWidth, height: slideHeight }]}>
            <View style={styles.depthBack} />
            <View style={styles.depthMid} />
            <ImageWithFallback uri={court.image} style={styles.image} label={court.name} />
            <LinearGradient colors={['rgba(23,16,20,0.04)', 'rgba(58,0,29,0.48)', 'rgba(26,16,21,0.90)']} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFillObject} />
            <View style={styles.courtLine} />
            <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 450 }} style={styles.copy}>
              <Text style={styles.kicker}>{copy.kicker}</Text>
              <Text style={styles.title}>{copy.title}</Text>
              <Text style={styles.subtitle}>{copy.subtitle}</Text>
            </MotiView>
          </View>
        )})}
      </ScrollView>
      <View style={styles.dots}>
        {slides.map((slide, index) => (
          <View key={slide.id} style={[styles.dot, active === index && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: { marginRight: 0, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.deep, shadowColor: '#000', shadowOpacity: 0.24, shadowRadius: 24, shadowOffset: { width: 0, height: 16 }, elevation: 10, transform: [{ perspective: 900 }, { rotateX: '0.8deg' }] },
  depthBack: { position: 'absolute', left: 26, right: 26, bottom: -18, height: 44, borderRadius: 28, backgroundColor: 'rgba(58,0,29,0.26)', transform: [{ scaleX: 0.92 }] },
  depthMid: { position: 'absolute', left: 14, right: 14, bottom: -8, height: 28, borderRadius: 24, backgroundColor: 'rgba(138,30,77,0.22)' },
  image: { width: '100%', height: '100%' },
  courtLine: { position: 'absolute', left: 20, right: 20, top: 24, height: 2, backgroundColor: 'rgba(255,255,255,0.72)', opacity: 0.85 },
  copy: { position: 'absolute', left: 20, right: 20, bottom: 22 },
  kicker: { color: '#F2DCE7', fontWeight: '900', marginBottom: 8, fontSize: 12, textTransform: 'uppercase' },
  title: { color: '#FFFFFF', fontWeight: '900', fontSize: 32, lineHeight: 37, marginBottom: 8 },
  subtitle: { color: '#F7EEF2', fontWeight: '700', fontSize: 15, lineHeight: 21 },
  dots: { flexDirection: 'row', gap: 6, alignSelf: 'center', marginTop: 10 },
  dot: { width: 7, height: 7, borderRadius: 999, backgroundColor: colors.border },
  dotActive: { width: 22, backgroundColor: colors.primary },
});
