import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // 1. Verify Admin Session
    const { data: { user: requester } } = await supabase.auth.getUser()
    if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', requester.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 2. Process Upload
    const adminClient = createAdminClient()
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'misc'

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const { data, error: uploadError } = await adminClient.storage
      .from('myola')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) throw uploadError

    // 3. Get Public URL
    const { data: { publicUrl } } = adminClient.storage
      .from('myola')
      .getPublicUrl(filePath)

    return NextResponse.json({ success: true, url: publicUrl, path: filePath })
  } catch (error: any) {
    console.error('Admin upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
