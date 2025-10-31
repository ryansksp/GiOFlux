// Supabase SDK imports and initialization
import { supabase } from './client';
import { supabaseAuth } from './auth';
import { supabaseDatabase } from './database';
import { supabaseConfig } from './config';

// Export services
export { supabaseAuth } from './auth';
export { supabaseDatabase } from './database';
export { supabaseConfig } from './config';
export { supabase };

// Default export for convenience
export default {
  auth: supabaseAuth,
  database: supabaseDatabase,
  client: supabase
};
