import { isSupabaseConfigured, supabaseRest } from '@/lib/supabase';

export interface PartnerOffer {
  id: string;
  partnerName: string;
  category: 'gear' | 'food' | 'fitness' | 'travel' | 'wellness';
  offerTitle: string;
  validity: string;
  redemptionMethod: string;
  isPremiumOnly: boolean;
}

export const partnerOfferService = {
  async listOffers(): Promise<PartnerOffer[]> {
    if (isSupabaseConfigured) {
      try {
        return await supabaseRest.select<PartnerOffer>('partner_offers');
      } catch {
        // Local fallback.
      }
    }
    return [
      { id: 'offer1', partnerName: '974 Pro Shop', category: 'gear', offerTitle: '10% off racket grips', validity: 'May 2026', redemptionMethod: 'Show profile at counter', isPremiumOnly: false },
      { id: 'offer2', partnerName: 'Recovery Lounge Doha', category: 'wellness', offerTitle: 'Premium recovery session', validity: 'June 2026', redemptionMethod: 'Premium code later', isPremiumOnly: true },
    ];
  },
};
