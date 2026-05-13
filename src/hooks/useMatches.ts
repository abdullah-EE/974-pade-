import { useAppState } from '@/state/AppState';

export function useMatches() {
  const { matches, addMatch, updateMatchStatus } = useAppState();
  return { matches, addMatch, updateMatchStatus };
}
