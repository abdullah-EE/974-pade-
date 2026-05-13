import { challenges as seedChallenges, courts, matches as seedMatches, openGames as seedOpenGames, players } from '@/data/mockData';
import { Challenge, Match, OpenGame } from '@/types/models';
import { calculateRatingDelta } from './rankingEngine';
import { BackendClient } from './types';

let challenges: Challenge[] = [...seedChallenges];
let matches: Match[] = [...seedMatches];
let openGames: OpenGame[] = [...seedOpenGames];
let friendIds = new Set(['p2', 'p5', 'p11']);

export const localBackend: BackendClient = {
  async getCurrentProfile() {
    return players[0];
  },
  async upsertProfile(account) {
    return {
      ...players[0],
      id: account.id || players[0].id,
      name: account.name,
      username: account.username.startsWith('@') ? account.username : `@${account.username}`,
      level: account.level,
      area: account.favoriteArea,
      club: account.favoriteArea,
    };
  },
  async listCourts() {
    return courts;
  },
  async listPlayers(query) {
    const value = query?.trim().toLowerCase();
    if (!value) return players;
    return players.filter((player) =>
      `${player.name} ${player.username} ${player.club} ${player.level}`.toLowerCase().includes(value),
    );
  },
  async listFriends() {
    return players.filter((player) => friendIds.has(player.id));
  },
  async addFriend(_profileId, friendId) {
    friendIds.add(friendId);
  },
  async removeFriend(_profileId, friendId) {
    friendIds.delete(friendId);
  },
  async listOpenGames() {
    return openGames;
  },
  async joinOpenGame(id, profileId = players[0].id) {
    openGames = openGames.map((game) =>
      game.id === id
        ? { ...game, joined: true, playerIds: game.playerIds.includes(profileId) ? game.playerIds : [...game.playerIds, profileId] }
        : game,
    );
  },
  async listChallenges(profileId) {
    if (!profileId) return challenges;
    return challenges.filter((challenge) => challenge.from === profileId || challenge.to === profileId || challenge.opponentIds?.includes(profileId));
  },
  async createChallenge(challenge) {
    const created = { ...challenge, id: `local-${Date.now()}`, status: 'Sent' as const };
    challenges = [created, ...challenges];
    if (created.privacy === 'Public' && created.to === 'open') {
      openGames = [
        {
          id: `og-${created.id}`,
          courtId: created.courtId,
          startsAt: created.startsAt,
          level: created.level,
          hostId: created.from,
          playerIds: [created.from],
          capacity: created.type === 'singles' ? 2 : 4,
          privacy: created.privacy,
        },
        ...openGames,
      ];
    }
    return created;
  },
  async updateChallenge(id, status) {
    challenges = challenges.map((challenge) => (challenge.id === id ? { ...challenge, status } : challenge));
  },
  async listMatches(profileId) {
    if (!profileId) return matches;
    return matches.filter((match) => [...match.teamA, ...match.teamB].includes(profileId));
  },
  async submitMatch(match) {
    const created = { ...match, id: `local-${Date.now()}`, status: 'Pending' as const, verificationStatus: 'pendingOpponent' as const };
    matches = [created, ...matches];
    return created;
  },
  async updateMatchStatus(id, status) {
    matches = matches.map((match) => (match.id === id ? { ...match, status } : match));
  },
  async confirmMatch(id) {
    matches = matches.map((match) => (match.id === id ? { ...match, status: 'Verified', verificationStatus: 'confirmed' } : match));
  },
  async disputeMatch(id) {
    matches = matches.map((match) => (match.id === id ? { ...match, status: 'Disputed', verificationStatus: 'disputed' } : match));
  },
  async previewRatingDelta(match) {
    const teamA = match.teamA.map((id) => players.find((player) => player.id === id)).filter(Boolean) as typeof players;
    const teamB = match.teamB.map((id) => players.find((player) => player.id === id)).filter(Boolean) as typeof players;
    return calculateRatingDelta(teamA, teamB, match.winner);
  },
};
