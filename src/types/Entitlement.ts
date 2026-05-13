export interface Entitlement {
  id: string;
  userId: string;
  subscriptionTier: 'free' | 'premium';
  adSlotVisible: boolean;
  premiumFeatureLocked: boolean;
  walletBalance: number;
  credits: number;
  cosmeticsOwned: string[];
  coachProfileEnabled?: boolean;
  videoPostEnabled?: boolean;
}
