import { Player } from '@/types/models';

export const playerService = {
  async searchPlayers(players: Player[], query: string) {
    const value = query.trim().toLowerCase();
    if (!value) return players;
    return players.filter((player) => `${player.name} ${player.username} ${player.club} ${player.level}`.toLowerCase().includes(value));
  },
  async getPlayer(players: Player[], id: string) {
    return players.find((player) => player.id === id) || null;
  },
};
