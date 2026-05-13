import { isSupabaseConfigured, supabaseRest } from '@/lib/supabase';

export type NotificationType =
  | 'friend_request'
  | 'challenge_invite'
  | 'challenge_accepted'
  | 'match_needs_confirmation'
  | 'match_confirmed'
  | 'ranking_changed'
  | 'coach_request'
  | 'tournament_update';

export const notificationService = {
  async create(userId: string, type: NotificationType, body: string) {
    if (isSupabaseConfigured) {
      await supabaseRest.insert('notifications', { user_id: userId, type, body, read: false });
    }
    return { id: `local-${Date.now()}`, userId, type, body, read: false };
  },
};
