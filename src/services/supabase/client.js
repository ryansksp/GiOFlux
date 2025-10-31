import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from './config';

// Create Supabase client
export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Export for convenience
export default supabase;
