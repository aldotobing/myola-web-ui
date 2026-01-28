import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { userId, paymentReference, paymentMethod } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // 1. Update membership status to active
    const { data: membership, error: membershipError } = await supabase
      .from('memberships')
      .update({
        status: 'active',
        payment_status: 'paid',
        payment_reference: paymentReference,
        payment_method: paymentMethod,
        activated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('status', 'pending')
      .select()
      .single()

    if (membershipError) {
      console.error('Error activating membership:', membershipError)
      return NextResponse.json({ error: membershipError.message }, { status: 400 })
    }

    // 2. Add points to profile (49,000 as per requirement)
    const bonusPoints = 49000
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('points_balance')
      .eq('user_id', userId)
      .single()

    if (profileError) throw profileError

    const newBalance = (profile.points_balance || 0) + bonusPoints

    const { error: updatePointsError } = await supabase
      .from('profiles')
      .update({ points_balance: newBalance })
      .eq('user_id', userId)

    if (updatePointsError) throw updatePointsError

    // 3. Log point transaction
    await supabase.from('point_transactions').insert({
      user_id: userId,
      transaction_type: 'join_member',
      amount: bonusPoints,
      balance_after: newBalance,
      reference_type: 'membership',
      reference_id: membership.id,
      description: 'Bonus join member',
    })

    // 4. Handle sales commission if referral was used
    if (membership.sales_id) {
      const { data: sales } = await supabase
        .from('sales')
        .select('commission_rate')
        .eq('id', membership.sales_id)
        .single()
      
      if (sales) {
        const commissionAmount = 99000 * (sales.commission_rate || 0.07)
        
        await supabase.from('commissions').insert({
          sales_id: membership.sales_id,
          user_id: userId,
          commission_type: 'join_member',
          reference_id: membership.id,
          transaction_amount: 99000,
          commission_rate: sales.commission_rate || 0.07,
          commission_amount: commissionAmount,
          status: 'pending'
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Finalize membership error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
