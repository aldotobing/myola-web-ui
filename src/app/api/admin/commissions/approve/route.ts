import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user: requester } } = await supabase.auth.getUser()
    
    if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: requesterProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', requester.id)
      .single()

    if (requesterProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const adminClient = createAdminClient()
    const { commissionId, reference } = await request.json()

    if (!commissionId) {
      return NextResponse.json({ error: 'Commission ID is required' }, { status: 400 })
    }

    const { data, error } = await adminClient
      .from('commissions')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        payout_reference: reference || `MANUAL-${Date.now()}`
      })
      .eq('id', commissionId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Commission approval error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
