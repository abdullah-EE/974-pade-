import AsyncStorage from '@react-native-async-storage/async-storage';
import { isSupabaseConfigured, supabaseAuth, supabaseRest } from '@/lib/supabase';
import { LocalAccount } from '@/types/models';
import { isValidUsername, sanitizeText } from '@/utils/validation';

const ACCOUNT_KEY = '974-padel.local-account';
const ACCOUNTS_KEY = '974-padel.local-accounts';
const FRIENDS_KEY = '974-padel.friend-ids';

type ProfileRow = {
  id: string;
  user_id: string;
  name: string;
  username: string;
  avatar_url?: string;
  level: LocalAccount['level'];
  area?: LocalAccount['favoriteArea'];
  favorite_area?: LocalAccount['favoriteArea'];
  favorite_court_id?: string;
  role?: 'player' | 'coach' | 'both' | 'club_owner' | 'admin';
  account_role?: 'player' | 'coach' | 'both';
  subscription_tier?: 'free' | 'premium';
  email?: string;
  created_at?: string;
};

function normalizeUsername(username: string) {
  const clean = sanitizeText(username, 32).replace(/^@/, '').toLowerCase();
  return `@${clean}`;
}

function rowToAccount(row: ProfileRow): LocalAccount {
  return {
    id: row.id,
    name: row.name,
    username: row.username.startsWith('@') ? row.username : `@${row.username}`,
    avatarUrl: row.avatar_url,
    level: row.level,
    favoriteArea: row.favorite_area || row.area || 'Lusail',
    favoriteCourtId: row.favorite_court_id,
    subscriptionTier: row.subscription_tier || 'free',
    accountRole: row.account_role || (row.role === 'coach' ? 'coach' : 'player'),
    email: row.email,
    createdAt: row.created_at,
  };
}

async function getRemoteProfile() {
  const session = await supabaseAuth.getSession();
  if (!session?.user?.id) return null;
  const [profile] = await supabaseRest.select<ProfileRow>('profiles', { user_id: `eq.${session.user.id}` });
  return profile ? rowToAccount(profile) : null;
}

async function saveRemoteProfile(account: LocalAccount) {
  const session = await supabaseAuth.getSession();
  if (!session?.user?.id) return null;
  const username = normalizeUsername(account.username);
  if (!isValidUsername(username)) throw new Error('Invalid username');
  const [profile] = await supabaseRest.upsert<ProfileRow>('profiles', {
    user_id: session.user.id,
    name: sanitizeText(account.name, 80),
    username,
    avatar_url: account.avatarUri || account.avatarUrl || null,
    level: account.level,
    area: account.favoriteArea,
    favorite_area: account.favoriteArea,
    favorite_court_id: account.favoriteCourtId || null,
    role: account.accountRole === 'coach' ? 'coach' : 'player',
    account_role: account.accountRole || 'player',
    subscription_tier: account.subscriptionTier || 'free',
    email: account.email || session.user.email || null,
  }, 'user_id');
  return rowToAccount(profile);
}

export const accountService = {
  async getAccount() {
    if (isSupabaseConfigured) {
      try {
        const remote = await getRemoteProfile();
        if (remote) {
          await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify(remote));
          return remote;
        }
      } catch {
        // Keep local fallback alive if Supabase is missing migrations or session.
      }
    }
    const raw = await AsyncStorage.getItem(ACCOUNT_KEY);
    return raw ? (JSON.parse(raw) as LocalAccount) : null;
  },
  async saveAccount(account: LocalAccount, password?: string) {
    let nextAccount = account;
    if (isSupabaseConfigured && account.email && password) {
      try {
        const signup = await supabaseAuth.signUp(account.email, password);
        if (!signup.access_token) {
          await supabaseAuth.signIn(account.email, password);
        }
        nextAccount = (await saveRemoteProfile(account)) || account;
      } catch {
        // Local account remains usable if email confirmation or migration setup is not complete yet.
      }
    } else if (isSupabaseConfigured) {
      try {
        nextAccount = (await saveRemoteProfile(account)) || account;
      } catch {
        // Local fallback.
      }
    }
    await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify(nextAccount));
    const accounts = await this.getAccounts();
    const next = [nextAccount, ...accounts.filter((item) => item.username !== nextAccount.username)];
    await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(next));
    return nextAccount;
  },
  async getAccounts() {
    const raw = await AsyncStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as LocalAccount[]) : [];
  },
  async login(username: string, password?: string) {
    if (isSupabaseConfigured && username.includes('@') && password) {
      try {
        await supabaseAuth.signIn(username.trim(), password);
        const profile = await getRemoteProfile();
        if (profile) {
          await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify(profile));
          return profile;
        }
      } catch {
        // Try local login below.
      }
    }
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
  async logout() {
    if (isSupabaseConfigured) {
      try {
        await supabaseAuth.signOut();
      } catch {
        // Clear local session regardless.
      }
    }
    await AsyncStorage.removeItem(ACCOUNT_KEY);
  },
};
