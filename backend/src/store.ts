import { BackendChallenge, BackendCoachProfile, BackendMatch, BackendProfile, BackendVideoPost } from './domain';

export const store = {
  profiles: new Map<string, BackendProfile>(),
  friends: new Map<string, Set<string>>(),
  challenges: new Map<string, BackendChallenge>(),
  matches: new Map<string, BackendMatch>(),
  coachProfiles: new Map<string, BackendCoachProfile>(),
  videos: new Map<string, BackendVideoPost>(),
  wallets: new Map<string, number>(),
};

export function id(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
