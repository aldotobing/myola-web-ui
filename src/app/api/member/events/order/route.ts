import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const adminClient = createAdminClient()
    const body = await request.json()
    
    const { 
      eventId,
      customerName,
      customerPhone,
      customerEmail,
      subtotal,
      redeemPoints,
      totalPayment,
      paymentMethod
    } = body

    const { data: { user } } = await adminClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // 1. Get member's sales_id
    const { data: membership } = await adminClient
      .from('memberships')
      .select('sales_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    const salesId = membership?.sales_id || null

    // 2. Create Event Order
    const orderNumber = `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    const { data: order, error: orderError } = await adminClient
      .from('event_orders')
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        event_id: eventId,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        subtotal: subtotal,
        redeem_points: redeemPoints,
        total_payment: totalPayment,
        payment_method: paymentMethod || 'QRIS',
        status: 'sedang_diproses'
      })
      .select()
      .single()

    if (orderError) throw orderError

    // 3. Log Commission for Sales (7%)
    if (salesId) {
      const commissionAmount = subtotal * 0.07 // 7% from event price
      await adminClient.from('commissions').insert({
        sales_id: salesId,
        user_id: user.id,
        commission_type: 'event_order',
        reference_id: order.id,
        transaction_amount: subtotal,
        commission_rate: 0.07,
        commission_amount: commissionAmount,
        status: 'pending'
      })
    }

    return NextResponse.json({ success: true, orderNumber })
  } catch (error: any) {
    console.error('Event order error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
