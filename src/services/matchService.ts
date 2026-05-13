import { Match } from '@/types/models';
import { isSupabaseConfigured, supabaseRest } from '@/lib/supabase';
import { isValidScore } from '@/utils/validation';

export const matchService = {
  async submitMatch(match: Match) {
    if (!isValidScore(match.score)) throw new Error('Invalid score format');
    if (isSupabaseConfigured) {
      try {
        const [created] = await supabaseRest.insert<Match>('matches', {
          court_id: match.courtId,
          team_a: match.teamA,
          team_b: match.teamB,
          winner: match.winner,
          score: match.score,
          proof_image_url: match.proofUri,
          status: 'pending_opponent',
          starts_at: match.startsAt,
        });
        return { ...match, ...created, status: 'Pending' as const, ratingChange: 0 };
      } catch {
        // Keep demo mode alive if Supabase is not migrated yet.
      }
    }
    return { ...match, status: 'Pending' as const, ratingChange: 0 };
  },
  async confirmMatch(match: Match) {
    return { ...match, status: 'Verified' as const, ratingChange: match.ratingChange || 10 };
  },
  async disputeMatch(match: Match) {
    return { ...match, status: 'Disputed' as const, ratingChange: 0 };
  },
};
