import { useMemo } from 'react';
import { useAppState } from '@/state/AppState';

export function usePlayers(query = '') {
  const { players, friendIds, addFriend, removeFriend } = useAppState();
  const filteredPlayers = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return players;
    return players.filter((player) => `${player.name} ${player.username} ${player.club} ${player.level}`.toLowerCase().includes(value));
  }, [players, query]);
  return { players, filteredPlayers, friendIds, addFriend, removeFriend };
}
