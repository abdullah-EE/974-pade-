import { isSupabaseConfigured, supabaseRest } from '@/lib/supabase';
import { sanitizeText } from '@/utils/validation';

export const reportService = {
  async submitReport(reporterId: string, targetType: string, targetId: string, reason: string) {
    const payload = { reporter_id: reporterId, target_type: targetType, target_id: targetId, reason: sanitizeText(reason, 500), status: 'open' };
    if (isSupabaseConfigured) {
      await supabaseRest.insert('reports', payload);
    }
    return { id: `local-${Date.now()}`, ...payload };
  },
};
