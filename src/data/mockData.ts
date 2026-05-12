import { Challenge, Court, Match, Player } from '@/types/models';
import { mockImages } from './mockImages';

const names = ['Ali','Omar','Khalid','Yousef','Fahad','Hamad','Salem','Nasser','Rayan','Mansour','Zaid','Tariq','Saif','Majed','Noah','Adam','Sami','Rashid','Ibrahim','Hamza','Faris','Bilal','Karim','Nabil','Qasim'];
export const players: Player[] = names.map((n,i)=>({id:`p${i+1}`,name:`${n} Al-${i+2}`,username:`@${n.toLowerCase()}${i+1}`,avatar:mockImages.player,rank:i+1,rating:1690-i*8,wins:22-i%7,losses:6+i%6,movement:(i%7)-3,level:i<8?'Advanced':i<17?'Intermediate':'Beginner',hand:i%5===0?'Left':'Right',side:i%2?'Backhand':'Forehand',verified:i<20,hotStreak:i%6===0}));

export const courts: Court[] = [
'Lusail Padel Club','The Pearl Padel','West Bay Padel Arena','Aspire Padel Courts','Katara Padel Club','Al Sadd Padel','Education City Padel','Doha Sports Park Padel','Msheireb Padel Club','Al Waab Padel'
].map((name,i)=>({id:`c${i+1}`,name,area:(['Lusail','The Pearl','West Bay','Aspire','Doha'] as const)[i%5],indoor:i%2===0,courts:4+(i%5),price:`QAR ${140+i*10}-${200+i*12}`,image:mockImages.featuredCourt,ranked:i%3!==0}));

export const matches: Match[] = Array.from({length:20}).map((_,i)=>({id:`m${i+1}`,playerA:players[i%25].id,playerB:players[(i+7)%25].id,score:i%2?'6-4 7-5':'4-6 6-3 10-8',winner:i%2?players[i%25].id:players[(i+7)%25].id,courtId:courts[i%10].id,date:`2026-05-${String((i%10)+1).padStart(2,'0')} 19:30`,ratingDelta:i%2?12:-9,status:(['Pending','Verified','Location Verified','Disputed'] as const)[i%4],proofImage:mockImages.proof}));

export const challenges: Challenge[] = Array.from({length:8}).map((_,i)=>({id:`ch${i+1}`,from:players[i].id,to:players[i+8].id,status:(['Incoming','Sent','Accepted'] as const)[i%3],date:`2026-05-${10+i}`}));
