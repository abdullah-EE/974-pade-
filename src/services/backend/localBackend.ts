import { challenges, courts, matches, openGames, players } from '@/data/mockData';
import { BackendClient } from './types';

export const localBackend: BackendClient = {
  async getCurrentProfile() {
    return players[0];
  },
  async upsertProfile(account) {
    return { ...players[0], name: account.name, username: account.username, level: account.level, club: account.favoriteArea };
  },
  async listCourts() {
    return courts;
  },
  async listPlayers(query) {
    const value = query?.trim().toLowerCase();
    if (!value) return players;
    return players.filter((player) => `${player.name} ${player.username} ${player.club}`.toLowerCase().includes(value));
  },
  async listOpenGames() {
    return openGames;
  },
  async joinOpenGame() {
    return undefined;
  },
  async listChallenges() {
    return challenges;
  },
  async createChallenge(challenge) {
    return { ...challenge, id: `local-${Date.now()}`, status: 'Sent' };
  },
  async updateChallenge() {
    return undefined;
  },
  async listMatches() {
    return matches;
  },
  async submitMatch(match) {
    return { ...match, id: `local-${Date.now()}`, status: 'Pending' };
  },
  async updateMatchStatus() {
    return undefined;
  },
};
