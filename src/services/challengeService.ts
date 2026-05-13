import { Challenge, Level } from '@/types/models';

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
    return {
      id: `local-${Date.now()}`,
      from: input.creatorId,
      to: input.opponentIds[0] || 'open',
      courtId: input.courtId,
      startsAt: input.startsAt,
      level: input.level,
      status: input.privacy === 'Public' && input.opponentIds.length === 0 ? 'Incoming' : 'Sent',
      note: input.note?.trim(),
      isPrivate: input.privacy === 'Private invite',
      privacy: input.privacy,
    };
  },
};
