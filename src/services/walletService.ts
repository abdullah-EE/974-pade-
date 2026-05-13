import { CreditTransaction, Wallet } from '@/types/Wallet';

export const walletService = {
  async earnCredits(wallet: Wallet, transaction: CreditTransaction) {
    return { ...wallet, credits: wallet.credits + transaction.amount, transactions: [transaction, ...wallet.transactions] };
  },
  async spendCredits(wallet: Wallet, amount: number) {
    if (wallet.credits < amount) return wallet;
    return { ...wallet, credits: wallet.credits - amount };
  },
};
