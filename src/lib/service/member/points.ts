/** @format */

import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export interface PointTransaction {
  id: string;
  user_id: string;
  transaction_type: 'join_member' | 'purchase_cashback' | 'redeem' | 'referral_bonus' | 'admin_adjustment';
  amount: number;
  balance_after: number;
  reference_type?: string;
  reference_id?: string;
  description?: string;
  created_at: string;
}

/**
 * Get all point transactions for a user
 */
export async function getPointTransactions(userId?: string): Promise<PointTransaction[]> {
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    userId = user.id;
  }

  const { data, error } = await supabase
    .from("point_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    if (error.message?.includes('AbortError')) return [];
    console.error("Error fetching point transactions:", error);
    return [];
  }

  return data || [];
}

/**
 * Map transaction type to human readable title
 */
export function getTransactionTitle(type: PointTransaction['transaction_type'], description?: string): string {
  if (description) return description;
  
  switch (type) {
    case 'join_member': return "Bonus Join Member";
    case 'purchase_cashback': return "Cashback Pembelian";
    case 'redeem': return "Penukaran Poin";
    case 'referral_bonus': return "Bonus Referral";
    case 'admin_adjustment': return "Penyesuaian Admin";
    default: return "Transaksi Poin";
  }
}