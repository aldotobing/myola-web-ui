import { createClient as getSupabase } from "@/utils/supabase/client";

export async function getMembership(userId?: string) {
  const supabase = getSupabase();

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
    console.error("Error fetching membership:", error);
    return null;
  }

  return data;
}

export async function updateProfile(userId: string, data: any) {
  const supabase = getSupabase();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: data.fullName,
      phone: data.phone,
      ktp_number: data.idNumber,
      // Add other fields if you have them in the schema
    })
    .eq("user_id", userId);

  if (error) throw error;
  return { success: true };
}
