import { useAppState } from '@/state/AppState';

export function useChallenges() {
  const { challenges, openGames, createChallenge, updateChallenge, joinOpenGame } = useAppState();
  return { challenges, openGames, createChallenge, updateChallenge, joinOpenGame };
}
