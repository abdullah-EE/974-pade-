export interface Friendship {
  id: string;
  userId: string;
  playerId: string;
  status: 'friend' | 'requested' | 'blocked';
  createdAt: string;
}
