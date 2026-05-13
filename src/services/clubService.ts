import { isSupabaseConfigured, supabaseRest } from '@/lib/supabase';

export interface Club {
  id: string;
  name: string;
  area: string;
  planTier: 'free' | 'club_pro';
  analyticsEnabled: boolean;
  featuredProfile: boolean;
  eventToolsEnabled: boolean;
}

export const clubService = {
  async listClubs(): Promise<Club[]> {
    if (isSupabaseConfigured) {
      try {
        return await supabaseRest.select<Club>('clubs');
      } catch {
        // Local fallback.
      }
    }
    return [
      { id: 'club-lusail', name: 'La Pelota Network', area: 'Lusail', planTier: 'club_pro', analyticsEnabled: true, featuredProfile: true, eventToolsEnabled: true },
      { id: 'club-aspire', name: 'Aspire Padel Community', area: 'Aspire', planTier: 'free', analyticsEnabled: false, featuredProfile: false, eventToolsEnabled: true },
    ];
  },
};
