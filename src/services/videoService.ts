import { VideoPost } from '@/types/VideoPost';
import { isSupabaseConfigured, supabaseRest } from '@/lib/supabase';
import { sanitizeText } from '@/utils/validation';

export const videoService = {
  async searchVideos(videos: VideoPost[], query: string) {
    if (isSupabaseConfigured) {
      try {
        const value = query.trim();
        const params = value ? { or: `(title.ilike.*${value}*,tag.ilike.*${value}*)` } : undefined;
        return await supabaseRest.select<VideoPost>('videos', params);
      } catch {
        // Local fallback.
      }
    }
    const value = query.trim().toLowerCase();
    if (!value) return videos;
    return videos.filter((video) => `${video.title} ${video.creatorName} ${video.tag}`.toLowerCase().includes(value));
  },
  async toggleLike(video: VideoPost) {
    if (isSupabaseConfigured) {
      try {
        await supabaseRest.insert('video_likes', { video_id: video.id, reaction: video.liked ? 'unlike' : 'like' });
      } catch {
        // Local fallback.
      }
    }
    return { ...video, liked: !video.liked };
  },
  async toggleSave(video: VideoPost) {
    if (isSupabaseConfigured) {
      try {
        await supabaseRest.insert('video_likes', { video_id: video.id, reaction: video.saved ? 'unsave' : 'save', note: sanitizeText(video.title, 120) });
      } catch {
        // Local fallback.
      }
    }
    return { ...video, saved: !video.saved };
  },
};
