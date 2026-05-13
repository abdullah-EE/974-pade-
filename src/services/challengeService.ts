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
  type?: Challenge['type'];
  note?: string;
}

function privacyToDb(privacy: NonNullable<Challenge['privacy']>) {
  if (privacy === 'Friends only') return 'friends_only';
  if (privacy === 'Private invite') return 'private_invite';
  return 'public';
}

function typeToDb(type?: Challenge['type']) {
  if (type === 'open game') return 'open_game';
  return type || 'doubles';
}

function statusToDb(status: Challenge['status']) {
  const value = String(status).toLowerCase();
  if (value === 'incoming') return 'sent';
  return value;
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
          privacy: privacyToDb(input.privacy),
          type: typeToDb(input.type),
          note: sanitizeText(input.note || '', 180),
          status: input.privacy === 'Public' && input.opponentIds.length === 0 ? 'open' : 'sent',
        });
        await Promise.all(input.opponentIds.map((id) => supabaseRest.insert('challenge_invites', { challenge_id: created.id, invited_profile_id: id, status: 'sent' })));
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
  async updateChallenge(id: string, status: Challenge['status']) {
    if (isSupabaseConfigured) {
      try {
        await supabaseRest.update('challenges', { status: statusToDb(status) }, { id: `eq.${id}` });
      } catch {
        // Local state remains live if RLS or migrations are not ready.
      }
    }
  },
};
