import { useAppState } from '@/state/AppState';

export function useAccount() {
  const { account, currentUser, createAccount } = useAppState();
  return { account, currentUser, createAccount };
}
