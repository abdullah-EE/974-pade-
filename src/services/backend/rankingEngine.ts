import { Match, Player } from '@/types/models';

const K_FACTOR = 28;

function expectedScore(ratingA: number, ratingB: number) {
  return 1 / (1 + 10 ** ((ratingB - ratingA) / 400));
}

export function calculateRatingDelta(teamA: Player[], teamB: Player[], winner: Match['winner']) {
  const aRating = teamA.reduce((sum, player) => sum + player.rating, 0) / Math.max(1, teamA.length);
  const bRating = teamB.reduce((sum, player) => sum + player.rating, 0) / Math.max(1, teamB.length);
  const expectedA = expectedScore(aRating, bRating);
  const actualA = winner === 'A' ? 1 : 0;
  return Math.round(K_FACTOR * (actualA - expectedA));
}

export function creditsForVerifiedMatch(won: boolean, streak: number) {
  return 40 + (won ? 25 : 10) + Math.min(40, Math.max(0, streak) * 5);
}
