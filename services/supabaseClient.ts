
import { createClient } from '@supabase/supabase-js';

// Use environment variables injected by Vite define, falling back to defaults if not provided.
const supabaseUrl = process.env.SUPABASE_URL || 'https://uiolzgpqxvswwslkmpip.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_YwBdOXh2_3imaD8o1wyT3g_U-1I3Isf';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
