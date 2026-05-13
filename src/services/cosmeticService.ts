import { CosmeticItem } from '@/types/Wallet';

export const cosmeticService = {
  async previewCosmetic(item: CosmeticItem) {
    return item;
  },
  async selectCosmetic(activeIds: string[], item: CosmeticItem) {
    if (!item.unlocked) return activeIds;
    return [...activeIds.filter((id) => id !== item.id), item.id];
  },
};
