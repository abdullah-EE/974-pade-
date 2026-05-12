import { Challenge, Court, Match, Player } from '@/types/models';
import { images } from './images';

const courtNames = ['La Pelota Lusail','La Pelota Education City','Padel One Qatar','Padel Garden Katara','Iconic Padel','Doha Oasis Padel','Al Messila Resort Padel Courts','Padel Lounge Private Court','Aspire Padel Courts','Al Waab Padel'] as const;
const areas = ['Lusail','Education City','Katara','Msheireb','The Pearl','West Bay','Aspire','Al Waab','Al Sadd','Umm Salal'] as const;
export const courts: Court[] = courtNames.map((name, i) => ({ id: `c${i+1}`, name, area: areas[i], indoor: i % 2 === 0, image: images.courts[i % images.courts.length], amenities: ['Parking','Café','Rental','Lockers','Coaching','Wi‑Fi'], timeSlots:['7:00','8:30','10:00'] }));

export const players: Player[] = Array.from({length:25}).map((_,i)=>({ id:`p${i+1}`, name:`Player ${i+1} Al Doha`, username:`@qtr${i+1}`, avatar:images.players[i], rank:i+1, rating:1860-i*9, movement:(i%5)-2, level:i<8?'Advanced':i<18?'Intermediate':'Beginner', verified:i<22, favoriteCourt:courts[i%10].name, wins:20-(i%7), losses:4+(i%5) }));

export const matches: Match[] = Array.from({length:20}).map((_,i)=>({ id:`m${i+1}`, teamA:[players[i%25].id, players[(i+1)%25].id], teamB:[players[(i+5)%25].id, players[(i+8)%25].id], winner:i%2?'A':'B', score:i%2?'6-4 6-3':'4-6 7-5 10-8', courtId:courts[i%10].id, date:`2026-05-${String((i%12)+1).padStart(2,'0')} 20:00`, ratingChange:8+(i%6), status:(['Pending','Verified','Disputed'] as const)[i%3] }));

export const challenges: Challenge[] = Array.from({length:8}).map((_,i)=>({ id:`ch${i+1}`, from:players[i].id, to:players[i+10].id, courtId:courts[i%10].id, date:`2026-05-${12+i} 21:00`, status:(['Incoming','Sent','Accepted'] as const)[i%3] }));

export const openGames = matches.slice(0,8);
