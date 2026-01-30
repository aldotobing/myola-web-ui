import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const adminClient = createAdminClient()
    const { courseId } = await request.json()

    if (!courseId) return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })

    // Check if already enrolled
    const { data: existing } = await adminClient
      .from('course_enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ success: true, message: 'Already enrolled' })
    }

    // Insert new enrollment
    const { error } = await adminClient
      .from('course_enrollments')
      .insert({
        user_id: user.id,
        course_id: courseId,
        status: 'not_started',
        progress: 0,
        enrolled_at: new Date().toISOString()
      })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Enrollment error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
