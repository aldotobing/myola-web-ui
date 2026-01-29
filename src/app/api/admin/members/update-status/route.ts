import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user: requester } } = await supabase.auth.getUser()
    if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', requester.id).single()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const adminClient = createAdminClient()
    const { userId, status } = await request.json()

    if (!userId || !status) {
      return NextResponse.json({ error: 'User ID and Status are required' }, { status: 400 })
    }

    const { data, error } = await adminClient
      .from('memberships')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .maybeSingle()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Update status error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
