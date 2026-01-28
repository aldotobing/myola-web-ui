/** @format */

import { createClient as getSupabase } from "@/utils/supabase/client";

/**
 * Get sales profile information for the logged-in user
 */
export async function getSalesProfile(userId?: string) {
  const supabase = getSupabase();

  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    userId = user.id;
  }

  const { data, error } = await supabase
    .from("sales")
    .select(`
      *,
      profiles:user_id (
        full_name,
        email:user_id,
        phone,
        avatar_url
      )
    `)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching sales profile:", error);
    return null;
  }

  return data;
}

/**
 * Get list of members referred by this sales person
 */
export async function getReferredMembers(salesId: string) {
  const supabase = getSupabase();

  // We look into memberships where sales_id matches, 
  // then join with profiles to get member info.
  const { data, error } = await supabase
    .from("memberships")
    .select(`
      id,
      status,
      created_at,
      profiles!memberships_user_id_profiles_fkey (
        user_id,
        full_name,
        phone,
        created_at
      )
    `)
    .eq("sales_id", salesId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching referred members:", error);
    return [];
  }

  return (data || [])
    .filter((item: any) => item.profiles !== null)
    .map((item: any) => ({
      id: item.profiles.user_id,
      fullName: item.profiles.full_name,
      phone: item.profiles.phone,
      joinDate: item.created_at,
      status: item.status
    }));
}

/**
 * Get commission logs for this sales person
 */
export async function getCommissionLogs(salesId: string) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("commissions")
    .select(`
      *,
      member:user_id (
        full_name
      )
    `)
    .eq("sales_id", salesId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching commissions:", error);
    return [];
  }

  return data;
}

/**
 * Get commission summary (Total, Pending, etc.)
 */
export async function getCommissionSummary(salesId: string) {
  const supabase = getSupabase();

  // 1. Get total member count
  const { count: memberCount } = await supabase
    .from("memberships")
    .select("*", { count: 'exact', head: true })
    .eq("sales_id", salesId);

  // 2. Get total paid/approved commission
  const { data: paidData } = await supabase
    .from("commissions")
    .select("commission_amount")
    .eq("sales_id", salesId)
    .or("status.eq.paid,status.eq.approved");

  const totalCommission = (paidData || []).reduce((sum, item) => sum + Number(item.commission_amount), 0);

  // 3. Get total pending commission
  const { data: pendingData } = await supabase
    .from("commissions")
    .select("commission_amount")
    .eq("sales_id", salesId)
    .eq("status", "pending");

  const pendingCommission = (pendingData || []).reduce((sum, item) => sum + Number(item.commission_amount), 0);

  return {
    member_count: memberCount || 0,
    total_commission: totalCommission,
    pending_commission: pendingCommission
  };
}

/**
 * Get performance data (commissions grouped by month for the last 6 months)
 */
export async function getPerformanceData(salesId: string) {
  const supabase = getSupabase();

  // Get commissions for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1); // Start of month

  const { data, error } = await supabase
    .from("commissions")
    .select("commission_amount, created_at")
    .eq("sales_id", salesId)
    .gte("created_at", sixMonthsAgo.toISOString())
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching performance data:", error);
    return [];
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const monthlyDataMap: Record<string, number> = {};
  
  // Initialize labels for the last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const label = `${monthNames[d.getMonth()]}`;
    monthlyDataMap[label] = 0;
  }

  // Fill with real data
  data?.forEach(item => {
    const date = new Date(item.created_at);
    const label = `${monthNames[date.getMonth()]}`;
    if (monthlyDataMap.hasOwnProperty(label)) {
      monthlyDataMap[label] += Number(item.commission_amount);
    }
  });

  return Object.entries(monthlyDataMap).map(([name, amount]) => ({
    name,
    amount
  }));
}
