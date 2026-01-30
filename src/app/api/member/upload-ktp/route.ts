import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

/**
 * GET: Used by Admin to fetch a signed URL for a KTP image
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user: requester } } = await supabase.auth.getUser()
    if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Verify Admin role
    const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', requester.id).single()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')

    if (!path) return NextResponse.json({ error: 'Path is required' }, { status: 400 })

    const adminClient = createAdminClient()
    
    // Create signed URL (1 hour expiry)
    const { data, error } = await adminClient.storage
      .from('myola')
      .createSignedUrl(path, 3600)

    if (error) throw error

    return NextResponse.json({ success: true, url: data.signedUrl })
  } catch (error: any) {
    console.error('KTP Signed URL error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * POST: Used during registration to upload KTP
 */
export async function POST(request: Request) {
  try {
    const adminClient = createAdminClient()
    const formData = await request.formData()
    
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    if (!file || !userId) {
      return NextResponse.json({ error: 'File and User ID are required' }, { status: 400 })
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `ktp/${fileName}`

    // Upload using admin client to bypass RLS
    const { data, error: uploadError } = await adminClient.storage
      .from('myola')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      console.error('Admin storage upload error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 400 })
    }

    // Update profile with the new path
    const { error: profileError } = await adminClient
      .from('profiles')
      .update({ ktp_image_url: filePath })
      .eq('user_id', userId)

    if (profileError) {
      console.error('Admin profile update error:', profileError)
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, path: filePath })
  } catch (error: any) {
    console.error('KTP Upload API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}