import { useMemo } from 'react';
import { useAppState } from '@/state/AppState';

export function useCoaches(query = '') {
  const { coaches, requestCoachSession } = useAppState();
  const filteredCoaches = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return coaches;
    return coaches.filter((coach) => `${coach.name} ${coach.specialty} ${coach.area} ${coach.level}`.toLowerCase().includes(value));
  }, [coaches, query]);
  return { coaches, filteredCoaches, requestCoachSession };
}
