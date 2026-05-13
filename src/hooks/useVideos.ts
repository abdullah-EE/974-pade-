import { useMemo } from 'react';
import { useAppState } from '@/state/AppState';

export function useVideos(query = '') {
  const { videos, toggleVideoLike, toggleVideoSave } = useAppState();
  const filteredVideos = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return videos;
    return videos.filter((video) => `${video.title} ${video.creatorName} ${video.tag}`.toLowerCase().includes(value));
  }, [query, videos]);
  return { videos, filteredVideos, toggleVideoLike, toggleVideoSave };
}
