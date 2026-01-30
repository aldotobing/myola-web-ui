/** @format */

import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function getMembership(userId?: string) {
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    userId = user.id;
  }

  const { data, error } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    if (error.message?.includes('AbortError')) return null;
    console.error("Error fetching membership:", error);
    return null;
  }

  return data;
}

export async function updateProfile(userId: string, data: any) {
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: data.fullName,
      phone: data.phone,
      ktp_number: data.idNumber,
    })
    .eq("user_id", userId);

  if (error) {
    if (error.message?.includes('AbortError')) return { success: false };
    throw error;
  }
  return { success: true };
}