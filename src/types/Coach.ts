import { Area, Level } from './models';

export interface Coach {
  id: string;
  name: string;
  avatarUrl?: string;
  heroImageUrl: string;
  specialty: string;
  level: Level;
  area: Area;
  courtId: string;
  rating: number;
  priceLabel: string;
  bio: string;
  specialties: string[];
  availableSlots: string[];
  requested?: boolean;
}
