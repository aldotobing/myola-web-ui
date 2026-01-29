/** @format */

import { createClient as getSupabase } from "@/utils/supabase/client";

// Helper to generate slugs
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-"); // Replace multiple - with single -
};

// =============================================================================
// 1. PRODUCT MANAGEMENT
// =============================================================================

export async function adminGetProducts() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_categories(name),
      product_images(*)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Map the primary image URL to a top-level image_url property for the UI
  return data.map((p: any) => ({
    ...p,
    image_url: p.product_images?.find((img: any) => img.is_primary)?.image_url || p.product_images?.[0]?.image_url
  }));
}

export async function adminGetCategories() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) throw error;
  return data;
}

export async function adminCreateCategory(name: string, description?: string) {
  const supabase = getSupabase();
  const slug = slugify(name);
  
  const { data, error } = await supabase
    .from("product_categories")
    .insert({
      name,
      slug,
      description,
      is_active: true
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminDeleteCategory(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("product_categories")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}

export async function adminCreateProduct(product: any, imageUrls: string[] = []) {
  const supabase = getSupabase();
  const slug = slugify(product.name);
  
  // 1. Insert product
  const { data: newProduct, error } = await supabase
    .from("products")
    .insert({
      ...product,
      slug,
      is_active: true
    })
    .select()
    .single();

  if (error) throw error;

  // 2. Insert images if any
  if (imageUrls.length > 0) {
    const imagesToInsert = imageUrls.map((url, index) => ({
      product_id: newProduct.id,
      image_url: url,
      is_primary: index === 0,
      sort_order: index
    }));

    await supabase.from("product_images").insert(imagesToInsert);
  }

  return newProduct;
}

export async function adminUpdateProduct(id: string, updates: any) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminDeleteProduct(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}

// =============================================================================
// 2. AKADEMI MANAGEMENT
// =============================================================================

export async function adminGetCourses() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function adminGetCourseById(id: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function adminCreateCourse(course: any) {
  const supabase = getSupabase();
  const slug = slugify(course.title);
  
  const { data, error } = await supabase
    .from("courses")
    .insert({
      ...course,
      slug,
      is_active: true,
      is_members_only: true
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminUpdateCourse(id: string, updates: any) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("courses")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminDeleteCourse(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}

export async function adminGetLessons(courseId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function adminCreateLesson(lesson: any) {
  const supabase = getSupabase();
  const slug = slugify(lesson.title);
  
  const { data, error } = await supabase
    .from("lessons")
    .insert({
      ...lesson,
      slug
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminUpdateLesson(id: string, updates: any) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("lessons")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminDeleteLesson(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("lessons")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}

export async function adminGetVideoModules(lessonId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("video_modules")
    .select("*")
    .eq("lesson_id", lessonId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function adminGetVideoModuleById(id: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("video_modules")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function adminCreateVideoModule(module: any) {
  const supabase = getSupabase();
  
  const { data, error } = await supabase
    .from("video_modules")
    .insert({
      ...module,
      is_active: true
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminUpdateVideoModule(id: string, updates: any) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("video_modules")
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminDeleteVideoModule(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("video_modules")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}

// =============================================================================
// 3. EVENT MANAGEMENT
// =============================================================================

export async function adminGetEvents() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function adminCreateEvent(event: any) {
  const supabase = getSupabase();
  const slug = slugify(event.title);
  
  const { data, error } = await supabase
    .from("events")
    .insert({
      ...event,
      slug,
      is_active: true
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =============================================================================
// 4. ORDER MANAGEMENT
// =============================================================================

export async function adminGetAllOrders() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      profiles:user_id(full_name, phone)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function adminUpdateOrderStatus(orderId: string, status: string, deliveryProofUrl?: string) {
  const supabase = getSupabase();
  const updates: any = { status, status_updated_at: new Date().toISOString() };
  
  if (deliveryProofUrl) {
    updates.delivery_proof_url = deliveryProofUrl;
    updates.delivered_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =============================================================================
// 5. USER & SALES MANAGEMENT
// =============================================================================

export async function adminGetMembers() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      *,
      memberships(status, payment_status)
    `)
    .eq("role", "member")
    .order("created_at", { ascending: false });

  if (error) throw error;
  
  // Flatten the response so UI can easily read 'status'
  return data.map((profile: any) => ({
    ...profile,
    membership_status: profile.memberships?.[0]?.status || 'no_record',
    payment_status: profile.memberships?.[0]?.payment_status || 'no_record'
  }));
}

export async function adminUpdateMemberPoints(userId: string, points: number, reason: string) {
  const supabase = getSupabase();
  
  // 1. Get current balance
  const { data: profile } = await supabase
    .from("profiles")
    .select("points_balance")
    .eq("user_id", userId)
    .single();

  const oldBalance = profile?.points_balance || 0;
  const newBalance = points; // We are setting the absolute value here, or we could do offset. Let's do absolute for admin control.

  // 2. Update profile
  const { data, error } = await supabase
    .from("profiles")
    .update({ points_balance: newBalance })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;

  // 3. Log transaction
  await supabase.from("point_transactions").insert({
    user_id: userId,
    transaction_type: 'admin_adjustment',
    amount: newBalance - oldBalance,
    balance_after: newBalance,
    description: reason || "Penyesuaian oleh Admin"
  });

  return data;
}

export async function adminGetSales() {
  const supabase = getSupabase();
  
  // 1. Fetch sales profiles
  const { data: sales, error } = await supabase
    .from("sales")
    .select(`
      *,
      profiles:user_id(full_name, phone, avatar_url, email:user_id)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // 2. Enhance with member count (still needs a count query)
  const enhancedSales = await Promise.all(sales.map(async (item) => {
    const { count } = await supabase
      .from("memberships")
      .select("*", { count: 'exact', head: true })
      .eq("sales_id", item.id);

    return {
      ...item,
      member_count: count || 0
    };
  }));

  return enhancedSales;
}

export async function adminGetCommissionReports() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("commissions")
    .select(`
      *,
      sales:sales_id(referral_code, profiles:user_id(full_name)),
      member:user_id(full_name)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function adminApproveCommission(commissionId: string, reference?: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("commissions")
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      payout_reference: reference || `MANUAL-${Date.now()}`
    })
    .eq("id", commissionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminUpdateMembershipStatus(userId: string, status: string) {
  const supabase = getSupabase();
  
  const { data, error } = await supabase
    .from("memberships")
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminGetDashboardStats() {
  const supabase = getSupabase();

  // 1. Total Penjualan (Product Orders + Event Orders) - excluding cancelled
  const { data: productSales } = await supabase
    .from("orders")
    .select("total_payment")
    .neq("status", "dibatalkan");
  
  const { data: eventSales } = await supabase
    .from("event_orders")
    .select("total_payment")
    .neq("status", "dibatalkan");

  const totalProductAmount = (productSales || []).reduce((sum, o) => sum + Number(o.total_payment), 0);
  const totalEventAmount = (eventSales || []).reduce((sum, o) => sum + Number(o.total_payment), 0);
  const totalPenjualan = totalProductAmount + totalEventAmount;

  // 2. Member Aktif
  const { count: activeMembers } = await supabase
    .from("memberships")
    .select("*", { count: 'exact', head: true })
    .eq("status", "active");

  // 3. Pesanan Baru (Status 'sedang_diproses')
  const { count: newProductOrders } = await supabase
    .from("orders")
    .select("*", { count: 'exact', head: true })
    .eq("status", "sedang_diproses");

  const { count: newEventOrders } = await supabase
    .from("event_orders")
    .select("*", { count: 'exact', head: true })
    .eq("status", "sedang_diproses");

  const pesananBaru = (newProductOrders || 0) + (newEventOrders || 0);

  // 4. Kursus Akademi (Active)
  const { count: totalCourses } = await supabase
    .from("courses")
    .select("*", { count: 'exact', head: true })
    .eq("is_active", true);

  return {
    totalPenjualan,
    activeMembers: activeMembers || 0,
    pesananBaru,
    totalCourses: totalCourses || 0
  };
}