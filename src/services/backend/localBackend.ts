import { challenges as seedChallenges, courts, matches as seedMatches, players } from '@/data/mockData';
import { Challenge, Match } from '@/types/models';
import { calculateRatingDelta } from './rankingEngine';
import { BackendClient } from './types';

let challenges: Challenge[] = [...seedChallenges];
let matches: Match[] = [...seedMatches];
let friendIds = new Set(['p2', 'p4', 'p8']);

export const localBackend: BackendClient = {
  async getCurrentProfile() {
    return players[0];
  },
  async upsertProfile(account) {
    return {
      ...players[0],
      id: account.id || players[0].id,
      name: account.name,
      username: account.username,
      level: account.level,
    };
  },
  async listCourts() {
    return courts;
  },
  async listPlayers(query) {
    const value = query?.trim().toLowerCase();
    if (!value) return players;
    return players.filter((player) => `${player.name} ${player.username} ${player.favoriteCourt} ${player.level}`.toLowerCase().includes(value));
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
  async listChallenges(profileId) {
    if (!profileId) return challenges;
    return challenges.filter((challenge) => challenge.from === profileId || challenge.to === profileId);
  },
  async createChallenge(challenge) {
    const created = { ...challenge, id: `local-${Date.now()}`, status: 'Sent' as const };
    challenges = [created, ...challenges];
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
    const created = { ...match, id: `local-${Date.now()}`, status: 'Pending' as const };
    matches = [created, ...matches];
    return created;
  },
  async confirmMatch(id) {
    matches = matches.map((match) => (match.id === id ? { ...match, status: 'Verified' } : match));
  },
  async disputeMatch(id) {
    matches = matches.map((match) => (match.id === id ? { ...match, status: 'Disputed' } : match));
  },
  async previewRatingDelta(match) {
    const teamA = match.teamA.map((id) => players.find((player) => player.id === id)).filter(Boolean) as typeof players;
    const teamB = match.teamB.map((id) => players.find((player) => player.id === id)).filter(Boolean) as typeof players;
    return calculateRatingDelta(teamA, teamB, match.winner);
  },
};
