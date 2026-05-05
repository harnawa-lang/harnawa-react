import { createClient } from '@supabase/supabase-js'

// Route all Supabase traffic through Vercel's proxy (/supabase/*)
// so the browser never directly connects to supabase.co.
// This fixes office/ISP networks that block external domains.
const supabaseUrl = typeof window !== 'undefined'
  ? `${window.location.origin}/supabase`
  : (import.meta.env.VITE_SUPABASE_URL as string)

const supabaseKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY
) as string

if (!supabaseKey) {
  console.error('[Supabase] Missing anon key. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
