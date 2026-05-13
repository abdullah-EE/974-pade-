import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const SESSION_KEY = '974-padel.supabase-session';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const hasSupabaseConfig = isSupabaseConfigured;

type QueryParams = Record<string, string | number | boolean | undefined>;

export interface SupabaseSession {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  user?: {
    id: string;
    email?: string;
  };
}

let memorySession: SupabaseSession | null = null;

function restUrl(path: string, params?: QueryParams) {
  if (!SUPABASE_URL) throw new Error('Supabase URL is not configured');
  const url = new URL(`${SUPABASE_URL}/rest/v1/${path}`);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.set(key, String(value));
  });
  return url.toString();
}

function authUrl(path: string) {
  if (!SUPABASE_URL) throw new Error('Supabase URL is not configured');
  return `${SUPABASE_URL}/auth/v1/${path}`;
}

function rpcUrl(functionName: string) {
  if (!SUPABASE_URL) throw new Error('Supabase URL is not configured');
  return `${SUPABASE_URL}/rest/v1/rpc/${functionName}`;
}

async function getStoredSession() {
  if (memorySession) return memorySession;
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  memorySession = raw ? (JSON.parse(raw) as SupabaseSession) : null;
  return memorySession;
}

async function setStoredSession(session: SupabaseSession | null) {
  memorySession = session;
  if (session) await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else await AsyncStorage.removeItem(SESSION_KEY);
}

async function authHeaders(init?: RequestInit) {
  const session = await getStoredSession();
  return {
    apikey: SUPABASE_ANON_KEY!,
    Authorization: `Bearer ${session?.access_token || SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
    ...(init?.headers || {}),
  };
}

async function request<T>(path: string, init?: RequestInit, params?: QueryParams): Promise<T> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
  const response = await fetch(restUrl(path, params), {
    ...init,
    headers: await authHeaders(init),
  });
  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

async function authRequest<T>(path: string, body?: object) {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
  const response = await fetch(authUrl(path), {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY!,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) throw new Error(`Supabase auth failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export const supabaseAuth = {
  getSession: getStoredSession,
  async signUp(email: string, password: string) {
    const data = await authRequest<SupabaseSession>('signup', { email, password });
    if (data.access_token) await setStoredSession(data);
    return data;
  },
  async signIn(email: string, password: string) {
    const data = await authRequest<SupabaseSession>('token?grant_type=password', { email, password });
    await setStoredSession(data);
    return data;
  },
  async signOut() {
    await setStoredSession(null);
  },
};

export const supabaseRest = {
  select<T>(table: string, params?: QueryParams) {
    return request<T[]>(table, { method: 'GET' }, { select: '*', ...params });
  },
  insert<T>(table: string, values: object) {
    return request<T[]>(table, { method: 'POST', body: JSON.stringify(values) });
  },
  upsert<T>(table: string, values: object, onConflict?: string) {
    return request<T[]>(table, { method: 'POST', body: JSON.stringify(values), headers: { Prefer: 'resolution=merge-duplicates,return=representation' } }, onConflict ? { on_conflict: onConflict } : undefined);
  },
  update<T>(table: string, values: object, params: QueryParams) {
    return request<T[]>(table, { method: 'PATCH', body: JSON.stringify(values) }, params);
  },
  remove<T>(table: string, params: QueryParams) {
    return request<T[]>(table, { method: 'DELETE' }, params);
  },
  async rpc<T>(functionName: string, values: object) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    return fetch(rpcUrl(functionName), {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify(values),
    }).then(async (response) => {
      if (!response.ok) throw new Error(`Supabase RPC failed: ${response.status}`);
      return response.json() as Promise<T>;
    });
  },
};
