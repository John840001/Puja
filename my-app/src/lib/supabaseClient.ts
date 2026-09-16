import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

// If env vars are missing (e.g. before setup, or in a fork that hasn't
// been configured yet), export null instead of throwing so the rest of
// the app can render a friendly "not connected" message.
export const supabase = isSupabaseConfigured ? createClient(url!, anonKey!) : null;
