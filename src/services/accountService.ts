import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalAccount } from '@/types/models';

const ACCOUNT_KEY = '974-padel.local-account';
const ACCOUNTS_KEY = '974-padel.local-accounts';
const FRIENDS_KEY = '974-padel.friend-ids';

export const accountService = {
  async getAccount() {
    const raw = await AsyncStorage.getItem(ACCOUNT_KEY);
    return raw ? (JSON.parse(raw) as LocalAccount) : null;
  },
  async saveAccount(account: LocalAccount) {
    await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
    const accounts = await this.getAccounts();
    const next = [account, ...accounts.filter((item) => item.username !== account.username)];
    await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(next));
    return account;
  },
  async getAccounts() {
    const raw = await AsyncStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as LocalAccount[]) : [];
  },
  async login(username: string) {
    const clean = username.trim().startsWith('@') ? username.trim() : `@${username.trim()}`;
    const account = (await this.getAccounts()).find((item) => item.username === clean || item.email === username.trim());
    if (!account) return null;
    await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
    return account;
  },
  async getFriendIds() {
    const raw = await AsyncStorage.getItem(FRIENDS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : null;
  },
  async saveFriendIds(friendIds: string[]) {
    await AsyncStorage.setItem(FRIENDS_KEY, JSON.stringify(friendIds));
    return friendIds;
  },
};
