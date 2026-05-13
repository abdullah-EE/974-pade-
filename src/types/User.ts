import { Area, Level } from './models';

export type SubscriptionTier = 'free' | 'premium';

export interface User {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  level: Level;
  favoriteArea: Area;
  favoriteCourtId: string;
  rating: number;
  weeklyPoints: number;
  verifiedMatches: number;
  subscriptionTier: SubscriptionTier;
  walletBalance: number;
  credits: number;
  cosmeticsOwned: string[];
  activeTheme: string;
  createdAt: string;
}
