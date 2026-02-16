import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ixtxdrhvgjunuiwahkut.supabase.co';
const supabaseAnonKey = 'sb_publishable_WRbfR2R7UZhORjjqCCL9Dw_QDTRxvCR';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'hp_maintenance_auth',   // custom key avoids conflicts
    storage: window.localStorage,
    flowType: 'pkce'
  }
});