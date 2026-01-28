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

    // 3. Authorized. Use Admin Client for user creation logic
    const adminClient = createAdminClient()
    const { email, password, fullName, phone, referralCode } = await request.json()

    // Create the user in Auth
    const { data: authData, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    })

    if (createError) throw createError

    const userId = authData.user.id

    // Update the profile (Trigger might create basic, but we set role 'sales')
    const { error: profileError } = await adminClient
      .from('profiles')
      .update({
        full_name: fullName,
        phone: phone,
        role: 'sales'
      })
      .eq('user_id', userId)

    if (profileError) throw profileError

    // Create the sales record
    const { error: salesError } = await adminClient
      .from('sales')
      .insert({
        user_id: userId,
        referral_code: referralCode,
        commission_rate: 0.07,
        is_active: true
      })

    if (salesError) throw salesError

    return NextResponse.json({ success: true, userId })
  } catch (error: any) {
    console.error('Create sales error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}