import { Player } from '@/types/models';
import { isSupabaseConfigured, supabaseRest } from '@/lib/supabase';

export const friendService = {
  async listFriends(players: Player[], friendIds: string[]) {
    if (isSupabaseConfigured) {
      try {
        return await supabaseRest.select<Player>('friendships', { status: 'eq.accepted' });
      } catch {
        // Local fallback.
      }
    }
    return players.filter((player) => friendIds.includes(player.id));
  },
  async sendRequest(userId: string, friendId: string) {
    if (isSupabaseConfigured) {
      await supabaseRest.insert('friendships', { requester_id: userId, addressee_id: friendId, status: 'pending' });
    }
  },
  async acceptRequest(friendshipId: string) {
    if (isSupabaseConfigured) {
      await supabaseRest.update('friendships', { status: 'accepted' }, { id: `eq.${friendshipId}` });
    }
  },
  async removeFriend(userId: string, friendId: string) {
    if (isSupabaseConfigured) {
      await supabaseRest.remove('friendships', { requester_id: `eq.${userId}`, addressee_id: `eq.${friendId}` });
    }
  },
};
