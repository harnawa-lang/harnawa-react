import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
// Accept both key names (publishable = anon)
const supabaseKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY
) as string

if (!supabaseUrl || !supabaseKey) {
  console.error('[Supabase] Missing env vars. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
