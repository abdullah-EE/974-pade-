import { ImageSourcePropType } from 'react-native';

export type Area =
  | 'Lusail'
  | 'Education City'
  | 'Katara'
  | 'Msheireb'
  | 'The Pearl'
  | 'West Bay'
  | 'Al Markhiya'
  | 'Aspire'
  | 'Al Waab'
  | 'Al Sadd'
  | 'Umm Salal';

export type Level = 'Beginner' | 'Intermediate' | 'Advanced';
export type MatchStatus = 'Pending' | 'Verified' | 'Disputed' | 'pendingOpponent' | 'confirmed' | 'disputed';
export type ChallengeStatus = 'Incoming' | 'Sent' | 'Accepted' | 'Declined' | 'open' | 'sent' | 'incoming' | 'accepted' | 'declined' | 'completed';
export type AvailabilityStatus = 'available' | 'few-left' | 'full';
export type CourtAvailabilityStatus = 'Available tonight' | 'Few slots left' | 'Almost full' | 'Fully booked';
export type SubscriptionTier = 'Free' | 'Premium' | 'Pro';
export type VerificationRequirement = 'Opponent confirmation' | 'Proof photo' | 'GPS check' | 'Admin review';

export interface AvailabilitySlot {
  id: string;
  label: string;
  status: AvailabilityStatus;
}

export interface Court {
  id: string;
  name: string;
  area: Area;
  indoor: boolean;
  image: ImageSourcePropType | string;
  heroImageUrl?: string;
  cardImageUrl?: string;
  indoorOutdoor?: 'indoor' | 'outdoor';
  description: string;
  amenities: string[];
  priceRange: string;
  availabilitySlots: AvailabilitySlot[];
  availabilityStatus: CourtAvailabilityStatus;
  bookingUrl: string;
  instagramUrl?: string;
  mapsUrl?: string;
  rating: number;
  popularityScore?: number;
  rankedMatchSupported: boolean;
  externalBooking: string;
  interestedPlayerIds: string[];
  recentMatchIds: string[];
}

export interface Player {
  id: string;
  name: string;
  username: string;
  avatar: string;
  avatarUrl?: string;
  rank: number;
  rating: number;
  movement: number;
  level: Level;
  area?: Area;
  verified: boolean;
  isVerified?: boolean;
  favoriteCourtId: string;
  wins: number;
  losses: number;
  club: Area;
  streak: number;
  status?: 'online' | 'playingTonight' | 'available' | 'recentlyActive' | 'offline';
  isFriend?: boolean;
  verifiedMatches?: number;
  winRate?: number;
  weeklyPoints?: number;
  tokens?: number;
  subscriptionTier?: SubscriptionTier;
  cosmetics?: {
    profileTheme?: 'Classic' | 'Maroon Glass' | 'Court Green' | 'Pearl Elite';
    badgeFrame?: 'None' | 'Verified Ring' | 'Elite Glow';
  };
}

export interface Match {
  id: string;
  teamA: string[];
  teamB: string[];
  winner: 'A' | 'B';
  score: string;
  courtId: string;
  startsAt: string;
  ratingChange: number;
  status: MatchStatus;
  proofUri?: string;
  proofImageUri?: string;
  verificationStatus?: 'pendingOpponent' | 'confirmed' | 'disputed';
  verificationRequirements?: VerificationRequirement[];
}

export interface OpenGame {
  id: string;
  courtId: string;
  startsAt: string;
  level: Level;
  hostId: string;
  playerIds: string[];
  capacity: number;
  joined?: boolean;
  privacy?: 'Public' | 'Friends only' | 'Private invite';
  timeLabel?: string;
  price?: string;
}

export interface Challenge {
  id: string;
  from: string;
  to: string;
  opponentIds?: string[];
  courtId: string;
  startsAt: string;
  timeLabel?: string;
  level: Level;
  type?: 'singles' | 'doubles' | 'open game';
  status: ChallengeStatus;
  note?: string;
  isPrivate?: boolean;
  privacy?: 'Public' | 'Friends only' | 'Private invite';
}

export interface LocalAccount {
  id?: string;
  name: string;
  username: string;
  avatarUri?: string;
  avatarUrl?: string;
  level: Level;
  favoriteArea: Area;
  favoriteCourtId?: string;
  rating?: number;
  weeklyPoints?: number;
  verifiedMatches?: number;
  subscriptionTier?: 'free' | 'premium';
  walletBalance?: number;
  credits?: number;
  cosmeticsOwned?: string[];
  activeTheme?: string;
  accountRole?: 'player' | 'coach' | 'both';
  email?: string;
  createdAt?: string;
}
