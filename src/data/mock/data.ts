import { AppNotification, Challenge, Court, Match, Player } from '@/types/models';

export const me: Player = { id: 'me', name: 'You', rank: 18, movement: 3, form: 'WWLWW', matchesPlayed: 27, region: 'Doha' };

export const leaderboard: Player[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `p${i + 1}`,
  name: `Player ${i + 1}`,
  rank: i + 1,
  movement: (i % 5) - 2,
  form: ['WWLWW', 'WLWLW', 'LLWWW'][i % 3],
  matchesPlayed: 10 + i,
  region: ['Doha', 'West Bay', 'Lusail', 'Al Waab', 'The Pearl'][i % 5] as Player['region']
}));

export const matches: Match[] = [
  { id: 'm1', opponent: 'Player 7', score: '6-4, 6-3', date: '2026-05-11', status: 'pending', evidence: ['GPS captured', 'Photo attached'] },
  { id: 'm2', opponent: 'Player 3', score: '3-6, 6-2, 10-8', date: '2026-05-09', status: 'confirmed', evidence: ['Venue matched'] },
  { id: 'm3', opponent: 'Player 14', score: '4-6, 4-6', date: '2026-05-06', status: 'disputed', evidence: ['GPS captured'] }
];

export const challenges: Challenge[] = [
  { id: 'c1', opponent: 'Player 12', status: 'open' },
  { id: 'c2', opponent: 'Player 9', status: 'accepted' }
];

export const courts: Court[] = [
  { id: 'ct1', name: 'Doha Padel Arena', area: 'Doha', indoor: true },
  { id: 'ct2', name: 'Lusail Smash Club', area: 'Lusail', indoor: false }
];

export const notifications: AppNotification[] = [
  { id: 'n1', title: 'Verification needed', detail: 'Player 7 submitted a match result.' },
  { id: 'n2', title: 'Rank up!', detail: 'You moved from #21 to #18 this week.' }
];
