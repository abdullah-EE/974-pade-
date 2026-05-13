export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  reason: 'verifiedMatch' | 'winStreak' | 'profileComplete' | 'challengeJoined' | 'clipUploaded' | 'cosmeticSpend';
  createdAt: string;
}

export interface CosmeticItem {
  id: string;
  name: string;
  type: 'profileFrame' | 'avatarBorder' | 'playerCardTheme' | 'badgeDisplay' | 'courtBackground' | 'victoryAnimation';
  price: number;
  premiumOnly?: boolean;
  unlocked?: boolean;
  equipped?: boolean;
  description?: string;
  rarity?: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Founder' | 'Premium';
  accentColor?: string;
}

export interface UserCosmetic {
  userId: string;
  activeCosmeticIds: string[];
  ownedCosmeticIds: string[];
}

export interface Wallet {
  userId: string;
  credits: number;
  transactions: CreditTransaction[];
}

export type PremiumFeature = 'advancedStats' | 'premiumThemes' | 'priorityChallenges' | 'deepMatchHistory' | 'customBadges' | 'privateGroups';
