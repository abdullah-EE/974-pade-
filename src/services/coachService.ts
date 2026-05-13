import { Coach } from '@/types/Coach';
import { isSupabaseConfigured, supabaseRest } from '@/lib/supabase';
import { sanitizeText } from '@/utils/validation';

export const coachService = {
  async searchCoaches(coaches: Coach[], query: string) {
    if (isSupabaseConfigured) {
      try {
        const value = query.trim();
        const params = value ? { or: `(specialty.ilike.*${value}*,area.ilike.*${value}*)` } : undefined;
        return await supabaseRest.select<Coach>('coaches', params);
      } catch {
        // Local fallback.
      }
    }
    const value = query.trim().toLowerCase();
    if (!value) return coaches;
    return coaches.filter((coach) => `${coach.name} ${coach.specialty} ${coach.area} ${coach.level}`.toLowerCase().includes(value));
  },
  async requestSession(coach: Coach, slot: string) {
    if (isSupabaseConfigured) {
      try {
        await supabaseRest.insert('coach_requests', { coach_id: coach.id, requested_slot: sanitizeText(slot, 80), status: 'requested' });
      } catch {
        // Local fallback.
      }
    }
    return { ...coach, requested: true, requestedSlot: slot };
  },
};
