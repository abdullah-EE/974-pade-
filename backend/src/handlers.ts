import { BackendChallenge, BackendCoachProfile, BackendMatch, BackendProfile, BackendVideoPost } from './domain';
import { id, store } from './store';

export async function createProfile(input: Omit<BackendProfile, 'id' | 'rating' | 'weeklyPoints' | 'verifiedMatches' | 'createdAt'>) {
  const profile: BackendProfile = {
    ...input,
    id: id('user'),
    rating: 1800,
    weeklyPoints: 0,
    verifiedMatches: 0,
    accountRole: input.accountRole || 'player',
    createdAt: new Date().toISOString(),
  };
  store.profiles.set(profile.id, profile);
  store.wallets.set(profile.id, 120);
  return profile;
}

export async function loginProfile(usernameOrEmail: string) {
  const clean = usernameOrEmail.trim().toLowerCase();
  const profile = Array.from(store.profiles.values()).find((item) => item.username.toLowerCase() === clean || item.email?.toLowerCase() === clean);
  if (!profile) throw new Error('Profile not found');
  return profile;
}

export async function chooseAccountRole(userId: string, accountRole: BackendProfile['accountRole']) {
  const profile = store.profiles.get(userId);
  if (!profile) throw new Error('Profile not found');
  const next = { ...profile, accountRole };
  store.profiles.set(userId, next);
  return next;
}

export async function addFriend(userId: string, friendId: string) {
  const friends = store.friends.get(userId) || new Set<string>();
  friends.add(friendId);
  store.friends.set(userId, friends);
  return Array.from(friends);
}

export async function createChallenge(input: Omit<BackendChallenge, 'id' | 'status' | 'createdAt'>) {
  const challenge: BackendChallenge = {
    ...input,
    id: id('challenge'),
    status: 'Sent',
    createdAt: new Date().toISOString(),
  };
  store.challenges.set(challenge.id, challenge);
  return challenge;
}

export async function updateChallengeStatus(challengeId: string, status: BackendChallenge['status']) {
  const challenge = store.challenges.get(challengeId);
  if (!challenge) throw new Error('Challenge not found');
  const next = { ...challenge, status };
  store.challenges.set(challengeId, next);
  return next;
}

export async function submitMatch(input: Omit<BackendMatch, 'id' | 'status' | 'ratingChange' | 'createdAt'>) {
  const match: BackendMatch = {
    ...input,
    id: id('match'),
    status: 'Pending',
    ratingChange: 0,
    createdAt: new Date().toISOString(),
  };
  store.matches.set(match.id, match);
  return match;
}

export async function createCoachProfile(input: Omit<BackendCoachProfile, 'id' | 'verified' | 'createdAt'>) {
  const profile: BackendCoachProfile = {
    ...input,
    id: id('coach'),
    verified: false,
    createdAt: new Date().toISOString(),
  };
  store.coachProfiles.set(profile.id, profile);
  return profile;
}

export async function createVideo(input: Omit<BackendVideoPost, 'id' | 'views' | 'createdAt'>) {
  const video: BackendVideoPost = {
    ...input,
    id: id('video'),
    views: 0,
    createdAt: new Date().toISOString(),
  };
  store.videos.set(video.id, video);
  store.wallets.set(input.creatorId, (store.wallets.get(input.creatorId) || 0) + 40);
  return video;
}
