import { VideoPost } from '@/types/VideoPost';

export const videoService = {
  async searchVideos(videos: VideoPost[], query: string) {
    const value = query.trim().toLowerCase();
    if (!value) return videos;
    return videos.filter((video) => `${video.title} ${video.creatorName} ${video.tag}`.toLowerCase().includes(value));
  },
  async toggleLike(video: VideoPost) {
    return { ...video, liked: !video.liked };
  },
  async toggleSave(video: VideoPost) {
    return { ...video, saved: !video.saved };
  },
};
