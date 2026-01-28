import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

// Helper to generate slugs
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
    const body = await request.json()
    const { name, category_id, description, price, cashback_points, stock, imageUrls } = body

    const slug = slugify(name)

    // 1. Create product
    const { data: product, error: productError } = await adminClient
      .from('products')
      .insert({
        name,
        category_id,
        description,
        price,
        cashback_points,
        stock,
        slug,
        is_active: true
      })
      .select()
      .single()

    if (productError) throw productError

    // 2. Insert images
    if (imageUrls && imageUrls.length > 0) {
      const imagesToInsert = imageUrls.map((url: string, index: number) => ({
        product_id: product.id,
        image_url: url,
        is_primary: index === 0,
        sort_order: index
      }))

      await adminClient.from('product_images').insert(imagesToInsert)
    }

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    console.error('Product creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
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
    const body = await request.json()
    const { id, name, category_id, description, price, cashback_points, stock, imageUrls } = body

    if (!id) return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })

    const updates: any = {
      name,
      category_id,
      description,
      price,
      cashback_points,
      stock,
      updated_at: new Date().toISOString()
    }

    if (name) {
      updates.slug = slugify(name)
    }

    // 1. Update product
    const { data: product, error: productError } = await adminClient
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (productError) throw productError

    // 2. Update images if provided (simplistic: clear and re-add for this demo)
    if (imageUrls && imageUrls.length > 0) {
      // Delete old images
      await adminClient.from('product_images').delete().eq('product_id', id)
      
      // Insert new ones
      const imagesToInsert = imageUrls.map((url: string, index: number) => ({
        product_id: id,
        image_url: url,
        is_primary: index === 0,
        sort_order: index
      }))

      await adminClient.from('product_images').insert(imagesToInsert)
    }

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    console.error('Product update error:', error)
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
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Product deletion error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}