const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

type QueryParams = Record<string, string | number | boolean | undefined>;

function buildUrl(path: string, params?: QueryParams) {
  if (!SUPABASE_URL) throw new Error('Supabase URL is not configured');
  const url = new URL(`${SUPABASE_URL}/rest/v1/${path}`);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.set(key, String(value));
  });
  return url.toString();
}

async function request<T>(path: string, init?: RequestInit, params?: QueryParams): Promise<T> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
  const response = await fetch(buildUrl(path, params), {
    ...init,
    headers: {
      apikey: SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(init?.headers || {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const supabaseRest = {
  select<T>(table: string, params?: QueryParams) {
    return request<T[]>(table, { method: 'GET' }, { select: '*', ...params });
  },
  insert<T>(table: string, values: object) {
    return request<T[]>(table, { method: 'POST', body: JSON.stringify(values) });
  },
  update<T>(table: string, values: object, params: QueryParams) {
    return request<T[]>(table, { method: 'PATCH', body: JSON.stringify(values) }, params);
  },
  remove<T>(table: string, params: QueryParams) {
    return request<T[]>(table, { method: 'DELETE' }, params);
  },
};
