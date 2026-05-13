import { Challenge, Court, LocalAccount, Match, OpenGame, Player } from '@/types/models';

export interface BackendClient {
  getCurrentProfile(): Promise<Player | null>;
  upsertProfile(account: LocalAccount): Promise<Player>;
  listCourts(): Promise<Court[]>;
  listPlayers(query?: string): Promise<Player[]>;
  listFriends(profileId: string): Promise<Player[]>;
  addFriend(profileId: string, friendId: string): Promise<void>;
  removeFriend(profileId: string, friendId: string): Promise<void>;
  listOpenGames(): Promise<OpenGame[]>;
  joinOpenGame(id: string, profileId?: string): Promise<void>;
  listChallenges(profileId?: string): Promise<Challenge[]>;
  createChallenge(challenge: Omit<Challenge, 'id' | 'status'>): Promise<Challenge>;
  updateChallenge(id: string, status: Challenge['status']): Promise<void>;
  listMatches(profileId?: string): Promise<Match[]>;
  submitMatch(match: Omit<Match, 'id' | 'status'>): Promise<Match>;
  updateMatchStatus(id: string, status: Match['status']): Promise<void>;
  confirmMatch(id: string, profileId: string): Promise<void>;
  disputeMatch(id: string, profileId: string, note?: string): Promise<void>;
  previewRatingDelta(match: Pick<Match, 'teamA' | 'teamB' | 'winner'>): Promise<number>;
}
