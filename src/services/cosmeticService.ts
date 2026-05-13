import { CosmeticItem } from '@/types/Wallet';
import { isSupabaseConfigured, supabaseRest } from '@/lib/supabase';

export const cosmeticService = {
  async previewCosmetic(item: CosmeticItem) {
    return item;
  },
  async selectCosmetic(activeIds: string[], item: CosmeticItem) {
    if (!item.unlocked) return activeIds;
    if (isSupabaseConfigured) {
      try {
        await supabaseRest.insert('user_cosmetics', { cosmetic_id: item.id, equipped: true });
      } catch {
        // Local fallback.
      }
    }
    return [...activeIds.filter((id) => id !== item.id), item.id];
  },
};
