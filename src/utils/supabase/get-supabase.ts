import { createClient as createBrowserClient } from '@/utils/supabase/client'

export async function getSupabase() {
  if (typeof window !== 'undefined') {
    return createBrowserClient()
  }
  
  // To avoid Turbopack tracing next/headers into client bundle, 
  // we can use a conditional require if needed, or just accept that 
  // services using this shouldn't be imported in Client Components 
  // IF they are intended for server-only.
  
  // However, since we want them to work in both, we must be very careful.
  try {
    const { createClient: createServerClient } = await import('@/utils/supabase/server')
    return await createServerClient()
  } catch (e) {
    // Fallback to browser client if server client fails (e.g. in some edge cases)
    return createBrowserClient()
  }
}