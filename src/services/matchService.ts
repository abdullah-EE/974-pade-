import { Match, Player } from '@/types/models';
import { isSupabaseConfigured, supabaseRest } from '@/lib/supabase';
import { isValidScore } from '@/utils/validation';

export const matchService = {
  async submitMatch(match: Match) {
    if (!isValidScore(match.score)) throw new Error('Invalid score format');
    if (isSupabaseConfigured) {
      try {
        const [created] = await supabaseRest.insert<Match>('matches', {
          court_id: match.courtId,
          winner: match.winner,
          score: match.score,
          proof_image_url: match.proofUri,
          gps_latitude: match.gpsVerification?.latitude,
          gps_longitude: match.gpsVerification?.longitude,
          gps_accuracy_m: match.gpsVerification?.accuracy ? Math.round(match.gpsVerification.accuracy) : undefined,
          status: 'pending_opponent',
          starts_at: match.startsAt,
          ranking_source: match.rankingSource || 'friendly',
          tournament_id: match.tournamentId,
          friendly_stats_only: match.friendlyStatsOnly ?? match.rankingSource === 'friendly',
        });
        await Promise.all([
          ...match.teamA.map((profileId) => supabaseRest.insert('match_players', { match_id: created.id, profile_id: profileId, team: 'A' })),
          ...match.teamB.map((profileId) => supabaseRest.insert('match_players', { match_id: created.id, profile_id: profileId, team: 'B' })),
        ]);
        return { ...match, ...created, status: 'Pending' as const, ratingChange: 0 };
      } catch {
        // Keep demo mode alive if Supabase is not migrated yet.
      }
    }
    return { ...match, status: 'Pending' as const, ratingChange: 0 };
  },
  async confirmMatch(match: Match, profileId?: string, players?: Player[]) {
    if (isSupabaseConfigured && profileId) {
      try {
        await supabaseRest.rpc('confirm_match_and_apply_ranking', { p_match_id: match.id, p_profile_id: profileId, p_confirmation: 'confirmed' });
      } catch {
        try {
          await supabaseRest.insert('match_confirmations', { match_id: match.id, profile_id: profileId, status: 'confirmed' });
        } catch {
          // Local state still updates in demo mode.
        }
      }
    }
    void players;
    return { ...match, status: 'Verified' as const, ratingChange: match.ratingChange || 10 };
  },
  async disputeMatch(match: Match, profileId?: string) {
    if (isSupabaseConfigured && profileId) {
      try {
        await supabaseRest.rpc('confirm_match_and_apply_ranking', { p_match_id: match.id, p_profile_id: profileId, p_confirmation: 'disputed' });
      } catch {
        try {
          await supabaseRest.insert('match_confirmations', { match_id: match.id, profile_id: profileId, status: 'disputed' });
        } catch {
          // Local state still updates in demo mode.
        }
      }
    }
    return { ...match, status: 'Disputed' as const, ratingChange: 0 };
  },
};
