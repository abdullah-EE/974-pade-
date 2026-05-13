import { useMemo } from 'react';
import { useAppState } from '@/state/AppState';

export function useFriends(query = '') {
  const { players, friendIds, addFriend, removeFriend } = useAppState();
  const friends = useMemo(() => {
    const value = query.trim().toLowerCase();
    return players
      .filter((player) => friendIds.includes(player.id))
      .filter((player) => !value || `${player.name} ${player.username} ${player.club}`.toLowerCase().includes(value));
  }, [friendIds, players, query]);
  return { friends, friendIds, addFriend, removeFriend };
}
