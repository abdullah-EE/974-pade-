import { useMemo } from 'react';
import { useAppState } from '@/state/AppState';

export function useCourts(query = '', filter = 'All') {
  const { courts } = useAppState();
  const filteredCourts = useMemo(() => {
    const value = query.trim().toLowerCase();
    return courts.filter((court) => {
      const textMatch = `${court.name} ${court.area} ${court.description}`.toLowerCase().includes(value);
      const filterMatch =
        filter === 'All' ||
        filter === 'Tonight' ||
        (filter === 'Indoor' && court.indoor) ||
        (filter === 'Outdoor' && !court.indoor) ||
        court.area === filter;
      return textMatch && filterMatch;
    });
  }, [courts, filter, query]);
  return { courts, filteredCourts };
}
