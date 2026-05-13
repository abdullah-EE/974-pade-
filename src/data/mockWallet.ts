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
  { id: 'classic-frame', name: 'Classic Frame', type: 'profileFrame', price: 0, unlocked: true, equipped: true, description: 'Clean verified-player frame.' },
  { id: 'maroon-card', name: 'Maroon Glass Card', type: 'playerCardTheme', price: 0, unlocked: true, equipped: true, description: 'Default 974 dark glass player card.' },
  { id: 'pearl-border', name: 'Pearl Avatar Border', type: 'avatarBorder', price: 360, description: 'Bright pearl ring around your avatar.' },
  { id: 'elite-badge', name: 'Elite Badge Display', type: 'badgeDisplay', price: 620, premiumOnly: true, description: 'Premium animated badge shelf.' },
  { id: 'lusail-bg', name: 'Lusail Court Background', type: 'courtBackground', price: 480, description: 'Night-court profile background.' },
  { id: 'victory-flash', name: 'Victory Flash', type: 'victoryAnimation', price: 720, premiumOnly: true, description: 'Subtle rose flash after confirmed wins.' },
];
