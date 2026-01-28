/** @format */

import { Order, OrderItem, OrderStatus } from "@/types/order";
import { createClient as getSupabase } from "@/utils/supabase/client";

const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case "sedang_diproses":
      return "Sedang Diproses";
    case "sedang_dikirim":
      return "Sedang Dikirim";
    case "selesai":
      return "Selesai";
    default:
      return status;
  }
};

/**
 * Get all orders for the current user
 */
export async function getAllOrders(userId?: string): Promise<Order[]> {
  const supabase = getSupabase();

  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    userId = user.id;
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return orders.map((order: any) => ({
    id: order.id,
    orderNumber: order.order_number,
    date: new Date(order.created_at).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    }) + " - " + new Date(order.created_at).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: order.status as OrderStatus,
    statusText: getStatusText(order.status as OrderStatus),
    items: order.order_items.map((item: any) => ({
      id: item.id,
      name: item.product_name,
      price: Number(item.unit_price),
      quantity: item.quantity,
      image: item.product_image_url || "https://placehold.co/80x80/ec4899/ffffff?text=Product",
      cashback: item.cashback_total || 0,
    })),
    totalAmount: Number(order.subtotal),
    customerName: order.customer_name,
    customerPhone: order.customer_phone,
    address: order.shipping_address,
    paymentMethod: order.payment_method || "Unknown",
    subtotal: Number(order.subtotal),
    redeemPoints: order.redeem_points || 0,
    totalPayment: Number(order.total_payment),
    ppn: Number(order.ppn || 0),
    shippingCost: Number(order.shipping_cost || 0),
    deliveryProof: order.delivery_proof_url,
    notification: order.status === "sedang_dikirim" ? {
      type: "info",
      message: "Klik Pesanan Diterima untuk konfirmasi 🎉",
    } : order.status === "selesai" ? {
      type: "success",
      message: "Terima kasih telah berbelanja! Berikan ulasan untuk produk kami.",
    } : undefined,
  }));
}

/**
 * Get a single order by order number
 */
export async function getOrderByNumber(
  orderNumber: string,
  userId?: string
): Promise<Order | null> {
  const supabase = getSupabase();

  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    userId = user.id;
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(*)
    `)
    .eq("order_number", orderNumber)
    .eq("user_id", userId)
    .single();

  if (error || !order) {
    console.error("Error fetching order:", error);
    return null;
  }

  return {
    id: order.id,
    orderNumber: order.order_number,
    date: new Date(order.created_at).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    }) + " - " + new Date(order.created_at).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: order.status as OrderStatus,
    statusText: getStatusText(order.status as OrderStatus),
    items: order.order_items.map((item: any) => ({
      id: item.id,
      name: item.product_name,
      price: Number(item.unit_price),
      quantity: item.quantity,
      image: item.product_image_url || "https://placehold.co/80x80/ec4899/ffffff?text=Product",
      cashback: item.cashback_total || 0,
    })),
    totalAmount: Number(order.subtotal),
    customerName: order.customer_name,
    customerPhone: order.customer_phone,
    address: order.shipping_address,
    paymentMethod: order.payment_method || "Unknown",
    subtotal: Number(order.subtotal),
    redeemPoints: order.redeem_points || 0,
    totalPayment: Number(order.total_payment),
    ppn: Number(order.ppn || 0),
    shippingCost: Number(order.shipping_cost || 0),
    deliveryProof: order.delivery_proof_url,
    notification: order.status === "sedang_dikirim" ? {
      type: "info",
      message: "Klik Pesanan Diterima untuk konfirmasi 🎉",
    } : order.status === "selesai" ? {
      type: "success",
      message: "Terima kasih telah berbelanja! Berikan ulasan untuk produk kami.",
    } : undefined,
  };
}

/**
 * Confirm order delivery (Member side)
 */
export async function confirmOrderDelivery(
  orderNumber: string,
  photoFile?: File
): Promise<{ success: boolean; order?: Order; error?: string }> {
  const supabase = getSupabase();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    let photoUrl = "";
    if (photoFile) {
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${orderNumber}-${Math.random()}.${fileExt}`;
      const filePath = `delivery-proofs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('delivery-proofs')
        .upload(filePath, photoFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('delivery-proofs')
        .getPublicUrl(filePath);
      
      photoUrl = publicUrl;
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "selesai",
        delivery_proof_url: photoUrl,
        delivered_at: new Date().toISOString(),
        status_updated_at: new Date().toISOString(),
      })
      .eq("order_number", orderNumber)
      .eq("user_id", user.id);

    if (updateError) throw updateError;

    const updatedOrder = await getOrderByNumber(orderNumber, user.id);
    return { success: true, order: updatedOrder || undefined };
  } catch (error: any) {
    console.error("Error confirming delivery:", error);
    return { success: false, error: error.message };
  }
}
