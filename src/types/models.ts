export type Level = 'Beginner' | 'Intermediate' | 'Advanced';
export type VerificationStatus = 'Pending' | 'Verified' | 'Location Verified' | 'Disputed';
export type Area = 'Lusail' | 'Doha' | 'The Pearl' | 'West Bay' | 'Aspire';

export interface Player { id:string; name:string; username:string; avatar:string; rank:number; rating:number; wins:number; losses:number; movement:number; level:Level; hand:'Right'|'Left'; side:'Forehand'|'Backhand'; verified:boolean; hotStreak?:boolean; }
export interface Court { id:string; name:string; area:Area; indoor:boolean; courts:number; price:string; image:string; ranked:boolean; }
export interface Match { id:string; playerA:string; playerB:string; score:string; winner:string; courtId:string; date:string; ratingDelta:number; status:VerificationStatus; proofImage:string; }
export interface Challenge { id:string; from:string; to:string; status:'Incoming'|'Sent'|'Accepted'; date:string; }
