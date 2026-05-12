export type VerificationStatus = 'pending' | 'confirmed' | 'disputed';
export type Region = 'Doha' | 'West Bay' | 'Lusail' | 'Al Waab' | 'The Pearl';

export interface Player { id: string; name: string; rank: number; movement: number; form: string; matchesPlayed: number; region: Region; }
export interface Match { id: string; opponent: string; score: string; date: string; status: VerificationStatus; evidence: string[]; }
export interface Challenge { id: string; opponent: string; status: 'open' | 'accepted' | 'declined'; }
export interface Court { id: string; name: string; area: Region; indoor: boolean; }
export interface AppNotification { id: string; title: string; detail: string; }
