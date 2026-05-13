export type Level = 'Beginner' | 'Intermediate' | 'Advanced';
export type Privacy = 'Public' | 'Friends only' | 'Private invite';
export type ChallengeStatus = 'Incoming' | 'Sent' | 'Accepted' | 'Declined' | 'Completed';
export type MatchStatus = 'Pending' | 'Verified' | 'Disputed';

export interface BackendProfile {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  level: Level;
  favoriteArea?: string;
  favoriteCourtId?: string;
  rating: number;
  weeklyPoints: number;
  verifiedMatches: number;
  subscriptionTier: 'free' | 'premium';
  accountRole: 'player' | 'coach' | 'both';
  email?: string;
  createdAt: string;
}

export interface BackendChallenge {
  id: string;
  creatorId: string;
  opponentIds: string[];
  courtId: string;
  startsAt: string;
  level: Level;
  privacy: Privacy;
  type: 'singles' | 'doubles' | 'open game';
  status: ChallengeStatus;
  note?: string;
  createdAt: string;
}

export interface BackendMatch {
  id: string;
  courtId: string;
  teamA: string[];
  teamB: string[];
  score: string;
  proofImageUrl?: string;
  status: MatchStatus;
  ratingChange: number;
  createdAt: string;
}

export interface BackendCoachProfile {
  id: string;
  userId: string;
  specialty: string;
  priceLabel: string;
  bio: string;
  courtId: string;
  verified: boolean;
  createdAt: string;
}

export interface BackendVideoPost {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  tag: 'Match' | 'Training' | 'Tip' | 'Highlight';
  duration: string;
  views: number;
  createdAt: string;
}
