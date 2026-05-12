export type Area = 'Lusail' | 'Education City' | 'Katara' | 'Msheireb' | 'The Pearl' | 'West Bay' | 'Aspire' | 'Al Waab' | 'Al Sadd' | 'Umm Salal';
export type Level = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Court { id: string; name: string; area: Area; indoor: boolean; image: string; amenities: string[]; timeSlots: string[]; }
export interface Player { id: string; name: string; username: string; avatar: string; rank: number; rating: number; movement: number; level: Level; verified: boolean; favoriteCourt: string; wins:number; losses:number; }
export interface Match { id: string; teamA: string[]; teamB: string[]; winner: 'A'|'B'; score: string; courtId: string; date: string; ratingChange: number; status: 'Pending'|'Verified'|'Disputed'; }
export interface Challenge { id:string; from:string; to:string; courtId:string; date:string; status:'Incoming'|'Sent'|'Accepted'; }
