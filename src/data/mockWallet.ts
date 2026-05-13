import { CosmeticItem, Wallet } from '@/types/Wallet';

export const mockWallet: Wallet = {
  userId: 'p1',
  credits: 980,
  transactions: [
    { id: 'tx1', userId: 'p1', amount: 120, reason: 'verifiedMatch', createdAt: '2026-05-12T22:00:00+03:00' },
    { id: 'tx2', userId: 'p1', amount: 80, reason: 'winStreak', createdAt: '2026-05-11T22:00:00+03:00' },
    { id: 'tx3', userId: 'p1', amount: 50, reason: 'profileComplete', createdAt: '2026-05-10T12:00:00+03:00' },
  ],
};

export const mockCosmetics: CosmeticItem[] = [
  { id: 'classic-maroon', name: 'Classic Maroon', type: 'profileFrame', price: 0, unlocked: true, equipped: true, rarity: 'Common', accentColor: '#660033', description: 'Clean 974 maroon profile ring.' },
  { id: 'qatar-elite', name: 'Qatar Elite', type: 'profileFrame', price: 420, unlocked: true, rarity: 'Rare', accentColor: '#D45578', description: 'Dual maroon ring with Qatar-style edge marks.' },
  { id: 'pearl-champion', name: 'Pearl Champion', type: 'profileFrame', price: 520, rarity: 'Epic', accentColor: '#FFF7F2', description: 'Pearl outer rim for high-status match players.' },
  { id: 'neon-rose', name: 'Neon Rose', type: 'profileFrame', price: 640, rarity: 'Epic', accentColor: '#FF6F9B', description: 'Bright rose sports-tech glow for social standouts.' },
  { id: 'glass-court', name: 'Glass Court', type: 'profileFrame', price: 560, rarity: 'Rare', accentColor: '#BFA8B2', description: 'Translucent glass-wall ring inspired by indoor courts.' },
  { id: 'night-match', name: 'Night Match', type: 'profileFrame', price: 680, rarity: 'Epic', accentColor: '#7DE2A8', description: 'Dark arena ring with a sharp court-line accent.' },
  { id: 'verified-pro', name: 'Verified Pro', type: 'profileFrame', price: 760, rarity: 'Legendary', accentColor: '#7DE2A8', description: 'Verified-player frame for consistent match submitters.' },
  { id: 'tournament-winner', name: 'Tournament Winner', type: 'profileFrame', price: 900, rarity: 'Legendary', accentColor: '#FFB86B', description: 'Event champion ring with trophy-style side ticks.' },
  { id: 'club-captain', name: 'Club Captain', type: 'profileFrame', price: 720, rarity: 'Epic', accentColor: '#D45578', description: 'Team-leader ring for club and league identity.' },
  { id: 'founder-badge', name: 'Founder Badge', type: 'profileFrame', price: 0, premiumOnly: true, rarity: 'Founder', accentColor: '#FFF7F2', description: 'Founder-era profile ring reserved for early members.' },
  { id: 'streak-master', name: 'Streak Master', type: 'profileFrame', price: 840, rarity: 'Legendary', accentColor: '#FF6F9B', description: 'Hot-streak ring with layered rose motion energy.' },
  { id: 'premium-glow', name: 'Premium Glow', type: 'profileFrame', price: 0, premiumOnly: true, rarity: 'Premium', accentColor: '#FF6F9B', description: 'Premium-only luminous ring. Checkout connects later.' },
  { id: 'maroon-card', name: 'Maroon Glass Card', type: 'playerCardTheme', price: 0, unlocked: true, equipped: true, description: 'Default 974 dark glass player card.' },
  { id: 'pearl-border', name: 'Pearl Avatar Border', type: 'avatarBorder', price: 360, description: 'Bright pearl ring around your avatar.' },
  { id: 'elite-badge', name: 'Elite Badge Display', type: 'badgeDisplay', price: 620, premiumOnly: true, description: 'Premium animated badge shelf.' },
  { id: 'lusail-bg', name: 'Lusail Court Background', type: 'courtBackground', price: 480, description: 'Night-court profile background.' },
  { id: 'victory-flash', name: 'Victory Flash', type: 'victoryAnimation', price: 720, premiumOnly: true, description: 'Subtle rose flash after confirmed wins.' },
];
