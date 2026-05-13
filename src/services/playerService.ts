import { Player } from '@/types/models';
import { isSupabaseConfigured, supabaseRest } from '@/lib/supabase';

export const playerService = {
  async searchPlayers(players: Player[], query: string) {
    if (isSupabaseConfigured) {
      const value = query.trim();
      const params = value ? { or: `(name.ilike.*${value}*,username.ilike.*${value}*,level.ilike.*${value}*,area.ilike.*${value}*)` } : undefined;
      try {
        return (await supabaseRest.select<Player>('profiles', params)).map((player) => ({ ...player, avatar: player.avatar || player.avatarUrl || '' }));
      } catch {
        // Fall back to local mock data if the remote schema is not ready yet.
      }
    }
    const value = query.trim().toLowerCase();
    if (!value) return players;
    return players.filter((player) => `${player.name} ${player.username} ${player.club} ${player.level}`.toLowerCase().includes(value));
  },
  async getPlayer(players: Player[], id: string) {
    return players.find((player) => player.id === id) || null;
  },
};
