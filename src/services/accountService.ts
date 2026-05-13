import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalAccount } from '@/types/models';

const ACCOUNT_KEY = '974-padel.local-account';
const FRIENDS_KEY = '974-padel.friend-ids';

export const accountService = {
  async getAccount() {
    const raw = await AsyncStorage.getItem(ACCOUNT_KEY);
    return raw ? (JSON.parse(raw) as LocalAccount) : null;
  },
  async saveAccount(account: LocalAccount) {
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
