import { Challenge, Court, LocalAccount, Match, OpenGame, Player } from '@/types/models';

export interface BackendClient {
  getCurrentProfile(): Promise<Player | null>;
  upsertProfile(account: LocalAccount): Promise<Player>;
  listCourts(): Promise<Court[]>;
  listPlayers(query?: string): Promise<Player[]>;
  listOpenGames(): Promise<OpenGame[]>;
  joinOpenGame(id: string): Promise<void>;
  listChallenges(): Promise<Challenge[]>;
  createChallenge(challenge: Omit<Challenge, 'id' | 'status'>): Promise<Challenge>;
  updateChallenge(id: string, status: Challenge['status']): Promise<void>;
  listMatches(): Promise<Match[]>;
  submitMatch(match: Omit<Match, 'id' | 'status'>): Promise<Match>;
  updateMatchStatus(id: string, status: Match['status']): Promise<void>;
}
