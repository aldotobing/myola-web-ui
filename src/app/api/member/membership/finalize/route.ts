import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const adminClient = createAdminClient()
    const { userId, paymentReference, paymentMethod } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Update membership status to active. 
    // The Database Trigger (tr_on_membership_activated) will automatically:
    // 1. Award 49,000 points.
    // 2. Log the point transaction.
    // 3. Log the sales commission if a referrer exists.
    const { error: membershipError } = await adminClient
      .from('memberships')
      .update({
        status: 'active',
        payment_status: 'paid',
        payment_reference: paymentReference,
        payment_method: paymentMethod,
      })
      .eq('user_id', userId)
      .eq('status', 'pending')

    if (membershipError) {
      console.error('Error activating membership:', membershipError)
      return NextResponse.json({ error: membershipError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Finalize membership error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}