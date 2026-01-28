import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const formData = await request.json()

    const {
      email,
      password,
      namaLengkap,
      nomorKTP,
      referralCode,
      noHp,
      tempatLahir,
      tanggalLahir,
      jenisKelamin
    } = formData

    // 1. Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: namaLengkap,
        }
      }
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 400 })
    }

    const userId = authData.user.id

    // 2. Update profile with extra data (profile is auto-created by trigger)
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        ktp_number: nomorKTP,
        phone: noHp,
        // We could store other info in a metadata column or add columns to profiles
      })
      .eq('user_id', userId)

    if (profileError) {
      console.error('Profile update error:', profileError)
      // Non-fatal, we can continue
    }

    // 3. Create pending membership
    // First, find sales_id if referralCode is provided
    let salesId = null
    if (referralCode) {
      const { data: salesData } = await supabase
        .from('sales')
        .select('id')
        .eq('referral_code', referralCode)
        .eq('is_active', true)
        .single()
      
      if (salesData) {
        salesId = salesData.id
      }
    }

    const { error: membershipError } = await supabase
      .from('memberships')
      .insert({
        user_id: userId,
        sales_id: salesId,
        payment_amount: 99000,
        status: 'pending',
      })

    if (membershipError) {
      console.error('Membership creation error:', membershipError)
      return NextResponse.json({ error: membershipError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, userId })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
