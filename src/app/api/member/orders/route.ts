import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const adminClient = createAdminClient()
    const body = await request.json()
    
    const { 
      items, 
      subtotal, 
      redeemPoints, 
      totalAfterRedeem, 
      ppn, 
      shippingCost, 
      totalBayar, 
      totalCashback,
      address,
      paymentMethod
    } = body

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // 1. Get member's sales_id from memberships
    const { data: membership } = await adminClient
      .from('memberships')
      .select('sales_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    const salesId = membership?.sales_id || null

    // 2. Create Order
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    // Using adminClient here to ensure creation works regardless of public insert policies
    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        sales_id: salesId,
        customer_name: address.recipientName,
        customer_phone: address.phoneNumber,
        shipping_address: address.fullAddress,
        shipping_cost: shippingCost,
        subtotal: subtotal,
        ppn: ppn,
        redeem_points: redeemPoints,
        total_payment: totalBayar,
        cashback_earned: totalCashback,
        payment_method: paymentMethod || 'Selected Method',
        status: 'sedang_diproses'
      })
      .select()
      .single()

    if (orderError) throw orderError

    // 3. Create Order Items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      product_image_url: item.image,
      quantity: item.quantity,
      unit_price: item.price,
      subtotal: item.price * item.quantity,
      cashback_total: item.cashback * item.quantity
    }))

    const { error: itemsError } = await adminClient
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    // NOTE: Commission logging is now handled automatically by 
    // the Database Trigger 'tr_on_order_created' in your SQL schema.

    return NextResponse.json({ success: true, orderNumber })
  } catch (error: any) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}
