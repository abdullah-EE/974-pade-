import { Challenge, Court, Match, Player } from '@/types/models';
import { images } from './images';

const courtNames = [
  'La Pelota Lusail',
  'La Pelota Education City',
  'Padel One Qatar',
  'Padel Garden Katara',
  'Iconic Padel',
  'Doha Oasis Padel',
  'Al Messila Resort Padel Courts',
  'Padel Lounge Private Court',
  'Aspire Padel Courts',
  'Al Waab Padel',
] as const;

const areas = ['Lusail', 'Education City', 'Katara', 'Msheireb', 'The Pearl', 'West Bay', 'Aspire', 'Al Waab', 'Al Sadd', 'Umm Salal'] as const;

const playerNames = [
  'Abdullah Haydar',
  'Omar Al-Kuwari',
  'Hamad Al-Mannai',
  'Jassim Al-Sulaiti',
  'Khalid Al-Thani',
  'Youssef Al-Ansari',
  'Ali Al-Hajri',
  'Saad Al-Marri',
  'Ahmed Al-Mohannadi',
  'Mohammed Al-Naimi',
  'Nasser Al-Marri',
  'Diego Martinez',
  'Marco Silva',
  'James Carter',
  'Karim Haddad',
  'Rayan Mansour',
  'Lucas Ferreira',
  'Matteo Rossi',
  'Adam Williams',
  'Samir Haddad',
];

export const courts: Court[] = courtNames.map((name, i) => ({
  id: `c${i + 1}`,
  name,
  area: areas[i],
  indoor: i % 2 === 0,
  image: images.courts[i % images.courts.length],
  amenities: ['Parking', 'Cafe', 'Rental', 'Lockers', 'Coaching', 'Wi-Fi'],
  timeSlots: ['7:00 PM', '8:30 PM', '10:00 PM'],
}));

export const players: Player[] = playerNames.map((name, i) => ({
  id: `p${i + 1}`,
  name,
  username: `@${name.toLowerCase().replace(/[^a-z ]/g, '').replace(/ /g, '.')}`,
  avatar: images.players[i % images.players.length],
  rank: i + 1,
  rating: 1860 - i * 9,
  movement: (i % 5) - 2,
  level: i < 7 ? 'Advanced' : i < 16 ? 'Intermediate' : 'Beginner',
  verified: i < 18,
  favoriteCourt: courts[i % courts.length].name,
  wins: 20 - (i % 7),
  losses: 4 + (i % 5),
}));

export const matches: Match[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `m${i + 1}`,
  teamA: [players[i % players.length].id, players[(i + 1) % players.length].id],
  teamB: [players[(i + 5) % players.length].id, players[(i + 8) % players.length].id],
  winner: i % 2 ? 'A' : 'B',
  score: i % 2 ? '6-4 6-3' : '4-6 7-5 10-8',
  courtId: courts[i % courts.length].id,
  date: `2026-05-${String((i % 12) + 1).padStart(2, '0')} 8:00 PM`,
  ratingChange: 8 + (i % 6),
  status: (['Pending', 'Verified', 'Disputed'] as const)[i % 3],
}));

export const challenges: Challenge[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `ch${i + 1}`,
  from: players[i].id,
  to: players[(i + 10) % players.length].id,
  courtId: courts[i % courts.length].id,
  date: `2026-05-${12 + i} 9:00 PM`,
  status: (['Incoming', 'Sent', 'Accepted'] as const)[i % 3],
}));

export const openGames = matches.slice(0, 8);
