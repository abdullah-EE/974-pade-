export type VideoTag = 'Match' | 'Training' | 'Tip' | 'Highlight';

export interface VideoPost {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creatorName: string;
  thumbnailUrl: string;
  duration: string;
  tag: VideoTag;
  views: number;
  liked?: boolean;
  saved?: boolean;
  createdAt: string;
}
