import { Court } from '@/types/models';

export const courtService = {
  async searchCourts(courts: Court[], query: string, filter = 'All') {
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
  },
  async getCourt(courts: Court[], id: string) {
    return courts.find((court) => court.id === id) || null;
  },
};
