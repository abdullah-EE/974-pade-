import { challenges, courts, matches, players } from '../mockData';

export { challenges, courts, matches };
export const leaderboard = players;
export const me = players[0];

export const notifications = [
  { id: 'n1', title: 'Verification needed', detail: 'Omar Al-Kuwari submitted a match result.' },
  { id: 'n2', title: 'Rank up', detail: 'You moved up the Qatar leaderboard this week.' },
];
