import { Entitlement } from '@/types/Entitlement';

export const entitlementService = {
  async getEntitlement(entitlement: Entitlement) {
    return entitlement;
  },
  async previewPremium(entitlement: Entitlement) {
    return { ...entitlement, premiumFeatureLocked: true };
  },
};
