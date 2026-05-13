import { Challenge, Level } from '@/types/models';
import { isSupabaseConfigured, supabaseRest } from '@/lib/supabase';
import { sanitizeText } from '@/utils/validation';

export interface CreateChallengePayload {
  creatorId: string;
  opponentIds: string[];
  courtId: string;
  startsAt: string;
  level: Level;
  privacy: NonNullable<Challenge['privacy']>;
  note?: string;
}

export const challengeService = {
  async createChallenge(input: CreateChallengePayload): Promise<Challenge> {
    if (isSupabaseConfigured) {
      try {
        const [created] = await supabaseRest.insert<Challenge>('challenges', {
          creator_id: input.creatorId,
          court_id: input.courtId,
          starts_at: input.startsAt,
          level: input.level,
          privacy: input.privacy,
          note: sanitizeText(input.note || '', 180),
          status: input.privacy === 'Public' && input.opponentIds.length === 0 ? 'open' : 'sent',
        });
        return {
          ...created,
          id: created.id,
          from: input.creatorId,
          to: input.opponentIds[0] || 'open',
          opponentIds: input.opponentIds,
          courtId: input.courtId,
          startsAt: input.startsAt,
          status: input.privacy === 'Public' && input.opponentIds.length === 0 ? 'open' : 'sent',
        };
      } catch {
        // Remote schema may not be configured in demo mode.
      }
    }
    return {
      id: `local-${Date.now()}`,
      from: input.creatorId,
      to: input.opponentIds[0] || 'open',
      courtId: input.courtId,
      startsAt: input.startsAt,
      level: input.level,
      status: input.privacy === 'Public' && input.opponentIds.length === 0 ? 'Incoming' : 'Sent',
      note: sanitizeText(input.note || '', 180),
      isPrivate: input.privacy === 'Private invite',
      privacy: input.privacy,
    };
  },
};
