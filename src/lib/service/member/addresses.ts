/** @format */

import { Address, AddressFormData } from "@/types/address";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

/**
 * Get all addresses for a user
 */
export async function getUserAddresses(
  userId?: string
): Promise<Address[]> {
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    userId = user.id;
  }

  const { data: addresses, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    if (error.message?.includes('AbortError')) return [];
    console.error("Error fetching addresses:", error);
    return [];
  }

  return addresses.map((addr) => ({
    id: addr.id,
    recipientName: addr.recipient_name,
    phoneNumber: addr.phone_number,
    label: addr.label,
    fullAddress: addr.full_address,
    deliveryNote: addr.delivery_note,
    isPrimary: addr.is_primary,
    createdAt: addr.created_at,
    updatedAt: addr.updated_at,
  }));
}

/**
 * Get a single address by ID
 */
export async function getAddressById(
  addressId: string,
  userId?: string
): Promise<Address | null> {
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    userId = user.id;
  }

  const { data: addr, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("id", addressId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !addr) {
    if (error?.message?.includes('AbortError')) return null;
    return null;
  }

  return {
    id: addr.id,
    recipientName: addr.recipient_name,
    phoneNumber: addr.phone_number,
    label: addr.label,
    fullAddress: addr.full_address,
    deliveryNote: addr.delivery_note,
    isPrimary: addr.is_primary,
    createdAt: addr.created_at,
    updatedAt: addr.updated_at,
  };
}

/**
 * Get primary address
 */
export async function getPrimaryAddress(
  userId?: string
): Promise<Address | null> {
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    userId = user.id;
  }

  const { data: addr, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .eq("is_primary", true)
    .maybeSingle();

  if (error || !addr) {
    if (error?.message?.includes('AbortError')) return null;
    return null;
  }

  return {
    id: addr.id,
    recipientName: addr.recipient_name,
    phoneNumber: addr.phone_number,
    label: addr.label,
    fullAddress: addr.full_address,
    deliveryNote: addr.delivery_note,
    isPrimary: addr.is_primary,
    createdAt: addr.created_at,
    updatedAt: addr.updated_at,
  };
}

/**
 * Create new address
 */
export async function createAddress(
  data: AddressFormData,
  userId?: string
): Promise<{ success: boolean; address?: Address; error?: string }> {
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };
    userId = user.id;
  }

  try {
    if (data.isPrimary) {
      await supabase.from("addresses").update({ is_primary: false }).eq("user_id", userId);
    }

    const { data: newAddr, error } = await supabase
      .from("addresses")
      .insert({
        user_id: userId,
        recipient_name: data.recipientName,
        phone_number: data.phoneNumber,
        label: data.label,
        full_address: data.fullAddress,
        delivery_note: data.deliveryNote,
        is_primary: data.isPrimary,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      address: {
        id: newAddr.id,
        recipientName: newAddr.recipient_name,
        phoneNumber: newAddr.phone_number,
        label: newAddr.label,
        fullAddress: newAddr.full_address,
        deliveryNote: newAddr.delivery_note,
        isPrimary: newAddr.is_primary,
        createdAt: newAddr.created_at,
        updatedAt: newAddr.updated_at,
      },
    };
  } catch (error: any) {
    if (error.message?.includes('AbortError')) return { success: false };
    console.error("Error creating address:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Update existing address
 */
export async function updateAddress(
  addressId: string,
  data: AddressFormData,
  userId?: string
): Promise<{ success: boolean; address?: Address; error?: string }> {
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };
    userId = user.id;
  }

  try {
    if (data.isPrimary) {
      await supabase.from("addresses").update({ is_primary: false }).eq("user_id", userId);
    }

    const { data: updatedAddr, error } = await supabase
      .from("addresses")
      .update({
        recipient_name: data.recipientName,
        phone_number: data.phoneNumber,
        label: data.label,
        full_address: data.fullAddress,
        delivery_note: data.deliveryNote,
        is_primary: data.isPrimary,
      })
      .eq("id", addressId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      address: {
        id: updatedAddr.id,
        recipientName: updatedAddr.recipient_name,
        phoneNumber: updatedAddr.phone_number,
        label: updatedAddr.label,
        fullAddress: updatedAddr.full_address,
        deliveryNote: updatedAddr.delivery_note,
        isPrimary: updatedAddr.is_primary,
        createdAt: updatedAddr.created_at,
        updatedAt: updatedAddr.updated_at,
      },
    };
  } catch (error: any) {
    if (error.message?.includes('AbortError')) return { success: false };
    console.error("Error updating address:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete address
 */
export async function deleteAddress(
  addressId: string,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };
    userId = user.id;
  }

  try {
    const { data: addr } = await supabase.from("addresses").select("is_primary").eq("id", addressId).maybeSingle();

    if (addr?.is_primary) {
      const { count } = await supabase.from("addresses").select("*", { count: 'exact', head: true }).eq("user_id", userId);
      if (count && count > 1) {
        return { success: false, error: "Cannot delete primary address." };
      }
    }

    const { error } = await supabase.from("addresses").delete().eq("id", addressId).eq("user_id", userId);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    if (error.message?.includes('AbortError')) return { success: false };
    console.error("Error deleting address:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Set address as primary
 */
export async function setPrimaryAddress(
  addressId: string,
  userId?: string
): Promise<{ success: boolean; address?: Address; error?: string }> {
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };
    userId = user.id;
  }

  try {
    await supabase.from("addresses").update({ is_primary: false }).eq("user_id", userId);
    const { data: updatedAddr, error } = await supabase.from("addresses").update({ is_primary: true }).eq("id", addressId).eq("user_id", userId).select().single();
    if (error) throw error;
    return {
      success: true,
      address: {
        id: updatedAddr.id,
        recipientName: updatedAddr.recipient_name,
        phoneNumber: updatedAddr.phone_number,
        label: updatedAddr.label,
        fullAddress: updatedAddr.full_address,
        deliveryNote: updatedAddr.delivery_note,
        isPrimary: updatedAddr.is_primary,
        createdAt: updatedAddr.created_at,
        updatedAt: updatedAddr.updated_at,
      },
    };
  } catch (error: any) {
    if (error.message?.includes('AbortError')) return { success: false };
    console.error("Error setting primary address:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get address count
 */
export async function getAddressCount(
  userId?: string
): Promise<number> {
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;
    userId = user.id;
  }

  const { count, error } = await supabase.from("addresses").select("*", { count: 'exact', head: true }).eq("user_id", userId);
  if (error) return 0;
  return count || 0;
}