import { Player } from '@/types/models';
import { isSupabaseConfigured, supabaseRest } from '@/lib/supabase';

type ProfileSearchRow = {
  id: string;
  name: string;
  username: string;
  avatar_url?: string;
  level?: Player['level'];
  area?: Player['area'];
  favorite_area?: Player['area'];
  favorite_court_id?: string;
  rating?: number;
  weekly_points?: number;
  verified_matches?: number;
  player_stats?: {
    rating?: number;
    weekly_points?: number;
    verified_match_count?: number;
    streak?: number;
    wins?: number;
    losses?: number;
  };
};

function mapProfile(row: ProfileSearchRow, index: number): Player {
  const stats = row.player_stats;
  return {
    id: row.id,
    name: row.name,
    username: row.username?.startsWith('@') ? row.username : `@${row.username}`,
    avatar: row.avatar_url || '',
    avatarUrl: row.avatar_url || '',
    rank: index + 1,
    rating: stats?.rating || row.rating || 1800,
    movement: 0,
    level: row.level || 'Intermediate',
    area: row.area || row.favorite_area || 'Lusail',
    verified: true,
    isVerified: true,
    favoriteCourtId: row.favorite_court_id || 'c1',
    wins: stats?.wins || 0,
    losses: stats?.losses || 0,
    club: row.area || row.favorite_area || 'Lusail',
    streak: stats?.streak || 0,
    verifiedMatches: stats?.verified_match_count || row.verified_matches || 0,
    weeklyPoints: stats?.weekly_points || row.weekly_points || 0,
    status: 'recentlyActive',
  };
}

export const playerService = {
  async searchPlayers(players: Player[], query: string) {
    if (isSupabaseConfigured) {
      const value = query.trim();
      const params = value ? { or: `(name.ilike.*${value}*,username.ilike.*${value}*,level.ilike.*${value}*,area.ilike.*${value}*,favorite_area.ilike.*${value}*)` } : undefined;
      try {
        return (await supabaseRest.select<ProfileSearchRow>('profiles', params)).map(mapProfile);
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
