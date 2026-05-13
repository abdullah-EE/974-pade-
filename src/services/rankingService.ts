import { Match, Player } from '@/types/models';

export function calculateExpectedScore(ratingA: number, ratingB: number) {
  return 1 / (1 + 10 ** ((ratingB - ratingA) / 400));
}

export function calculateEloDelta(teamA: Player[], teamB: Player[], winner: Match['winner']) {
  const ratingA = teamA.reduce((sum, player) => sum + player.rating, 0) / Math.max(1, teamA.length);
  const ratingB = teamB.reduce((sum, player) => sum + player.rating, 0) / Math.max(1, teamB.length);
  const expectedA = calculateExpectedScore(ratingA, ratingB);
  const actualA = winner === 'A' ? 1 : 0;
  return Math.round(28 * (actualA - expectedA));
}

export const rankingService = {
  previewDelta(players: Player[], match: Pick<Match, 'teamA' | 'teamB' | 'winner'>) {
    const teamA = match.teamA.map((id) => players.find((player) => player.id === id)).filter(Boolean) as Player[];
    const teamB = match.teamB.map((id) => players.find((player) => player.id === id)).filter(Boolean) as Player[];
    return calculateEloDelta(teamA, teamB, match.winner);
  },
  applyConfirmedMatch(player: Player, match: Match, delta: number) {
    const played = [...match.teamA, ...match.teamB].includes(player.id);
    if (!played || match.status !== 'Verified') return player;
    const won = (match.winner === 'A' && match.teamA.includes(player.id)) || (match.winner === 'B' && match.teamB.includes(player.id));
    return {
      ...player,
      rating: player.rating + (won ? Math.abs(delta) : -Math.abs(delta)),
      weeklyPoints: (player.weeklyPoints || 0) + (won ? 90 : 40),
      verifiedMatches: (player.verifiedMatches || 0) + 1,
      wins: player.wins + (won ? 1 : 0),
      losses: player.losses + (won ? 0 : 1),
      streak: won ? player.streak + 1 : 0,
    };
  },
};
