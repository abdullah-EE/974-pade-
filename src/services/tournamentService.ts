import { isSupabaseConfigured, supabaseRest } from '@/lib/supabase';

export interface Tournament {
  id: string;
  title: string;
  clubId?: string;
  format: 'league' | 'knockout' | 'round_robin';
  entryFee?: number;
  status: 'draft' | 'open' | 'running' | 'completed';
}

export const tournamentService = {
  async listTournaments(): Promise<Tournament[]> {
    if (isSupabaseConfigured) {
      try {
        return await supabaseRest.select<Tournament>('tournaments');
      } catch {
        // Local fallback.
      }
    }
    return [
      { id: 't1', title: 'Lusail Friday Ladder', clubId: 'club-lusail', format: 'league', entryFee: 75, status: 'open' },
      { id: 't2', title: 'Corporate Padel Cup', format: 'round_robin', entryFee: 150, status: 'draft' },
    ];
  },
};
