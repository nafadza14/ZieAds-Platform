
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uiolzgpqxvswwslkmpip.supabase.co';
const supabaseAnonKey = 'sb_publishable_YwBdOXh2_3imaD8o1wyT3g_U-1I3Isf';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
