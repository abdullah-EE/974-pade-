import { Coach } from '@/types/Coach';

export const coachService = {
  async searchCoaches(coaches: Coach[], query: string) {
    const value = query.trim().toLowerCase();
    if (!value) return coaches;
    return coaches.filter((coach) => `${coach.name} ${coach.specialty} ${coach.area} ${coach.level}`.toLowerCase().includes(value));
  },
  async requestSession(coach: Coach, slot: string) {
    return { ...coach, requested: true, requestedSlot: slot };
  },
};
