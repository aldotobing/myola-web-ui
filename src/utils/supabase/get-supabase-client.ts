import { createClient } from '@/utils/supabase/client'

export function getSupabase() {
  return createClient()
}
