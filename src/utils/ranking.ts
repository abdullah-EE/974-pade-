import { Player } from '@/types/models';

export function hybridScore(player: Player) {
  const verifiedWeight = player.verified ? 40 : 0;
  const formWeight = Math.max(0, player.streak) * 8;
  const weekly = player.weeklyPoints || 0;
  return player.rating + weekly * 0.35 + verifiedWeight + formWeight;
}

export function projectedRatingChange(winner: Player, loser: Player) {
  const expected = 1 / (1 + Math.pow(10, (loser.rating - winner.rating) / 400));
  return Math.round(28 * (1 - expected));
}
