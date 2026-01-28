import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user: requester } } = await supabase.auth.getUser()
    if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: requesterProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', requester.id)
      .single()

    if (requesterProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const adminClient = createAdminClient()
    const { name, description } = await request.json()

    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const slug = slugify(name)

    const { data, error } = await adminClient
      .from('product_categories')
      .insert({ name, slug, description, is_active: true })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, category: data })
  } catch (error: any) {
    console.error('Category creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user: requester } } = await supabase.auth.getUser()
    if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: requesterProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', requester.id)
      .single()

    if (requesterProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from('product_categories')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Category deletion error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
