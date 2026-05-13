import { Match } from '@/types/models';

export const matchService = {
  async submitMatch(match: Match) {
    return { ...match, status: 'Pending' as const, ratingChange: 0 };
  },
  async confirmMatch(match: Match) {
    return { ...match, status: 'Verified' as const, ratingChange: match.ratingChange || 10 };
  },
  async disputeMatch(match: Match) {
    return { ...match, status: 'Disputed' as const, ratingChange: 0 };
  },
};
