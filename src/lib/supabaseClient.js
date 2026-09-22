
import { createClient } from '@supabase/supabase-js';

// Las credenciales se leen de variables de entorno (archivo .env)
// NUNCA hardcodear API keys en el código fuente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;
