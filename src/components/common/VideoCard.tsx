import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { VideoPost } from '@/types/VideoPost';
import { colors, radius, shadow } from '@/theme/tokens';
import { ImageWithFallback } from './ImageWithFallback';

export function VideoCard({ video, onOpen }: { video: VideoPost; onOpen: () => void }) {
  return (
    <Pressable onPress={onOpen} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <ImageWithFallback uri={video.thumbnailUrl} style={styles.image} label={video.title} />
      <View style={styles.play}>
        <MaterialCommunityIcons name="play" size={22} color="#FFFFFF" />
      </View>
      <View style={styles.body}>
        <View style={styles.badgeRow}>
          <Text style={styles.badge}>{video.tag}</Text>
          <Text style={styles.duration}>{video.duration}</Text>
        </View>
        <Text numberOfLines={2} style={styles.title}>{video.title}</Text>
        <Text style={styles.meta}>{video.creatorName} - {video.views} views</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: 214, overflow: 'hidden', backgroundColor: '#FFFFFF', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, ...shadow },
  pressed: { transform: [{ scale: 0.982 }, { translateY: 1 }], shadowOpacity: 0.04 },
  image: { width: '100%', height: 148 },
  play: { position: 'absolute', top: 58, left: 82, width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(26,16,21,0.62)' },
  body: { padding: 12, gap: 7 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  badge: { overflow: 'hidden', color: colors.primary, backgroundColor: colors.softMaroon, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 5, fontWeight: '900', fontSize: 11 },
  duration: { color: colors.textSecondary, fontWeight: '900', fontSize: 11 },
  title: { minHeight: 39, color: colors.textPrimary, fontWeight: '900', fontSize: 15 },
  meta: { color: colors.textSecondary, fontWeight: '800', fontSize: 12 },
});
