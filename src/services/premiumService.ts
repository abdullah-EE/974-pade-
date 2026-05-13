export type PremiumFeature =
  | 'advanced_stats'
  | 'rival_compare'
  | 'deeper_match_history'
  | 'premium_profile_themes'
  | 'priority_challenge_visibility'
  | 'private_groups'
  | 'no_ads_later';

export const premiumFeatures: PremiumFeature[] = [
  'advanced_stats',
  'rival_compare',
  'deeper_match_history',
  'premium_profile_themes',
  'priority_challenge_visibility',
  'private_groups',
  'no_ads_later',
];

export const premiumService = {
  hasEntitlement(tier: 'free' | 'premium' | 'Free' | 'Premium' | 'Pro' | undefined, feature: PremiumFeature) {
    if (tier === 'premium' || tier === 'Premium' || tier === 'Pro') return true;
    return feature === 'no_ads_later' ? false : false;
  },
  lockedMessage(feature: PremiumFeature) {
    return `${feature.replace(/_/g, ' ')} is a Premium preview. Payments are not active yet.`;
  },
};
