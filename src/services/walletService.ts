import { CreditTransaction, Wallet } from '@/types/Wallet';
import { isSupabaseConfigured, supabaseRest } from '@/lib/supabase';

export const walletService = {
  async earnCredits(wallet: Wallet, transaction: CreditTransaction) {
    if (isSupabaseConfigured) {
      try {
        await supabaseRest.insert<CreditTransaction>('credit_transactions', transaction);
      } catch {
        // Local fallback below.
      }
    }
    return { ...wallet, credits: wallet.credits + transaction.amount, transactions: [transaction, ...wallet.transactions] };
  },
  async spendCredits(wallet: Wallet, amount: number) {
    if (wallet.credits < amount) return wallet;
    return { ...wallet, credits: wallet.credits - amount };
  },
};
