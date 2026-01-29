import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // 1. Initialize the standard server client to check session/cookies
    const supabase = await createClient()
    
    // Check if the requester is actually logged in
    const { data: { user: requester }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !requester) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Check if the requester has the 'admin' role
    const { data: requesterProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', requester.id)
      .single()

    if (requesterProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access only' }, { status: 403 })
    }

    // 3. Now that we've verified identity, use the Admin Client (Service Role) for bypass
    const adminClient = createAdminClient()
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Update membership status to active and payment to paid
    // This will trigger 'handle_membership_activation' in the DB automatically
    const { data, error: membershipError } = await adminClient
      .from('memberships')
      .update({
        status: 'active',
        payment_status: 'paid',
        activated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('status', 'pending')
      .select()

    if (membershipError) {
      console.error('Manual approval error:', membershipError)
      return NextResponse.json({ error: membershipError.message }, { status: 400 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'No pending membership found for this user' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Member approved and activated successfully' })
  } catch (error: any) {
    console.error('Approve member API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}