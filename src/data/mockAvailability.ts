import { courts } from './mockData';

export const mockAvailability = courts.map((court) => ({
  courtId: court.id,
  slots: court.availabilitySlots,
  availabilityStatus: court.availabilityStatus,
}));
