import { localBackend } from './localBackend';

// Swap this export to a Supabase-backed implementation once project URL,
// anon key, auth rules, and storage buckets are configured.
export const backend = localBackend;
export type { BackendClient } from './types';
