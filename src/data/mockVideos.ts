import { VideoPost } from '@/types/VideoPost';
import { images } from './images';

export const mockVideos: VideoPost[] = [
  {
    id: 'v1',
    title: 'Lusail glass-court comeback',
    description: 'A tight ranked rally sequence from a late match at La Pelota Lusail.',
    creatorId: 'p1',
    creatorName: 'Abdullah Haydar',
    thumbnailUrl: images.courts[0] as string,
    duration: '0:42',
    tag: 'Highlight',
    views: 1240,
    createdAt: '2026-05-12T21:00:00+03:00',
  },
  {
    id: 'v2',
    title: 'Coach Karim: wall-read drill',
    description: 'A quick training clip for reading the back glass before the ball drops.',
    creatorId: 'coach1',
    creatorName: 'Karim Haddad',
    thumbnailUrl: images.courts[2] as string,
    duration: '1:18',
    tag: 'Training',
    views: 860,
    createdAt: '2026-05-11T18:30:00+03:00',
  },
  {
    id: 'v3',
    title: 'Katara open game point',
    description: 'Community match highlight from an outdoor night session near Katara.',
    creatorId: 'p14',
    creatorName: 'Karim Haddad',
    thumbnailUrl: images.courts[8] as string,
    duration: '0:29',
    tag: 'Match',
    views: 540,
    createdAt: '2026-05-10T20:00:00+03:00',
  },
];
