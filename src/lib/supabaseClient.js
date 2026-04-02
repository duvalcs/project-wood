import { createClient } from '@supabase/supabase-js';

// Environment variables will be injected by Vercel in production
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl || 'https://placeholder-project.supabase.co', supabaseKey || 'placeholder-key');
