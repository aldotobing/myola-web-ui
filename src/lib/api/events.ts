/** @format */

// lib/api/events.ts
import { EventOrder, EventStatus, EventFilter } from "@/types/event";

// Mock data untuk event orders
const eventOrdersData: EventOrder[] = [
  {
    id: "event-order-1",
    orderNumber: "SM3719JDL0",
    eventTitle: "Precision Cutting For Modern Style",
    eventDate: "Sabtu, 18 Des 2025 - 20.34",
    orderDate: "Sabtu, 18 Des 2025 - 20.34",
    status: "sedang_diproses",
    statusText: "Sedang Diproses",
    items: [
      {
        id: "item-1",
        name: "Precision Cutting For Modern Style",
        price: 1500000,
        quantity: 1,
        image: "https://placehold.co/400x300/ec4899/ffffff?text=Event",
      },
    ],
    customerName: "Maria Klarasin",
    customerPhone: "089612756458",
    customerEmail: "mariaklarasin@gmail.com",
    paymentMethod: "QRIS",
    subtotal: 1500000,
    redeemPoints: 0,
    totalPayment: 1300000,
    hasETicket: true,
    eTicketSent: false,
  },
  {
    id: "event-order-2",
    orderNumber: "SM3719JDL0",
    eventTitle: "Precision Cutting For Modern Style",
    eventDate: "Sabtu, 18 Des 2025 - 20.34",
    orderDate: "Sabtu, 18 Des 2025 - 20.34",
    status: "aktif",
    statusText: "Aktif",
    items: [
      {
        id: "item-2",
        name: "Precision Cutting For Modern Style",
        price: 1500000,
        quantity: 1,
        image: "https://placehold.co/400x300/ec4899/ffffff?text=Event",
      },
    ],
    customerName: "Maria Klarasin",
    customerPhone: "089612756458",
    customerEmail: "mariaklarasin@gmail.com",
    paymentMethod: "QRIS",
    subtotal: 1500000,
    redeemPoints: 0,
    totalPayment: 400000,
    hasETicket: true,
    eTicketSent: true,
    eTicketUrl: "https://example.com/ticket/SM3719JDL0.pdf",
  },
  {
    id: "event-order-3",
    orderNumber: "SM3719JDL0",
    eventTitle: "Precision Cutting For Modern Style",
    eventDate: "Sabtu, 18 Des 2025 - 20.34",
    orderDate: "Sabtu, 18 Des 2025 - 20.34",
    status: "selesai",
    statusText: "Selesai",
    items: [
      {
        id: "item-3",
        name: "Precision Cutting For Modern Style",
        price: 1500000,
        quantity: 1,
        image: "https://placehold.co/400x300/ec4899/ffffff?text=Event",
      },
    ],
    customerName: "Maria Klarasin",
    customerPhone: "089612756458",
    customerEmail: "mariaklarasin@gmail.com",
    paymentMethod: "QRIS",
    subtotal: 1500000,
    redeemPoints: 0,
    totalPayment: 400000,
    hasETicket: true,
    eTicketSent: true,
    eTicketUrl: "https://example.com/ticket/SM3719JDL0.pdf",
  },
  {
    id: "event-order-4",
    orderNumber: "SM37623891",
    eventTitle: "Advanced Hair Coloring Workshop",
    eventDate: "Minggu, 25 Des 2025 - 10.00",
    orderDate: "Selasa, 15 Des 2025 - 14.20",
    status: "aktif",
    statusText: "Aktif",
    items: [
      {
        id: "item-4",
        name: "Advanced Hair Coloring Workshop",
        price: 2000000,
        quantity: 1,
        image: "https://placehold.co/400x300/ec4899/ffffff?text=Workshop",
      },
    ],
    customerName: "Maria Klarasin",
    customerPhone: "089612756458",
    customerEmail: "mariaklarasin@gmail.com",
    paymentMethod: "Transfer Bank",
    subtotal: 2000000,
    redeemPoints: 500000,
    totalPayment: 1500000,
    hasETicket: true,
    eTicketSent: true,
    eTicketUrl: "https://example.com/ticket/SM37623891.pdf",
  },
  {
    id: "event-order-5",
    orderNumber: "SM37623892",
    eventTitle: "Hair Styling Masterclass",
    eventDate: "Sabtu, 30 Des 2025 - 13.00",
    orderDate: "Rabu, 10 Des 2025 - 09.15",
    status: "selesai",
    statusText: "Selesai",
    items: [
      {
        id: "item-5",
        name: "Hair Styling Masterclass",
        price: 1800000,
        quantity: 1,
        image: "https://placehold.co/400x300/ec4899/ffffff?text=Masterclass",
      },
    ],
    customerName: "Maria Klarasin",
    customerPhone: "089612756458",
    customerEmail: "mariaklarasin@gmail.com",
    paymentMethod: "QRIS",
    subtotal: 1800000,
    redeemPoints: 300000,
    totalPayment: 1500000,
    hasETicket: true,
    eTicketSent: true,
    eTicketUrl: "https://example.com/ticket/SM37623892.pdf",
  },
];

/**
 * Get all event orders for a user
 */
export async function getUserEventOrders(
  userId: string = "user-1"
): Promise<EventOrder[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return eventOrdersData;
}

/**
 * Get event orders by status
 */
export async function getEventOrdersByStatus(
  status: EventStatus,
  userId: string = "user-1"
): Promise<EventOrder[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (status === "semua") {
    return eventOrdersData;
  }

  return eventOrdersData.filter((order) => order.status === status);
}

/**
 * Get event order by order number
 */
export async function getEventOrderByNumber(
  orderNumber: string,
  userId: string = "user-1"
): Promise<EventOrder | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const order = eventOrdersData.find((o) => o.orderNumber === orderNumber);
  return order || null;
}

/**
 * Get event order counts by status
 */
export async function getEventOrderCounts(userId: string = "user-1"): Promise<{
  semua: number;
  aktif: number;
  sedang_diproses: number;
  selesai: number;
}> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    semua: eventOrdersData.length,
    aktif: eventOrdersData.filter((o) => o.status === "aktif").length,
    sedang_diproses: eventOrdersData.filter(
      (o) => o.status === "sedang_diproses"
    ).length,
    selesai: eventOrdersData.filter((o) => o.status === "selesai").length,
  };
}

/**
 * Download e-ticket
 */
export async function downloadETicket(
  orderNumber: string,
  userId: string = "user-1"
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const order = eventOrdersData.find((o) => o.orderNumber === orderNumber);

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    if (!order.eTicketUrl) {
      return { success: false, error: "E-ticket not available" };
    }

    return { success: true, url: order.eTicketUrl };
  } catch (error) {
    return { success: false, error: "Failed to download e-ticket" };
  }
}

/**
 * Resend e-ticket to email
 */
export async function resendETicket(
  orderNumber: string,
  userId: string = "user-1"
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const order = eventOrdersData.find((o) => o.orderNumber === orderNumber);

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    if (!order.hasETicket) {
      return { success: false, error: "E-ticket not available for this order" };
    }

    // Mark as sent
    order.eTicketSent = true;

    return {
      success: true,
      message: `E-ticket berhasil dikirim ke ${order.customerEmail}`,
    };
  } catch (error) {
    return { success: false, error: "Failed to resend e-ticket" };
  }
}

/**
 * Filter event orders
 */
export async function filterEventOrders(
  filter: EventFilter,
  userId: string = "user-1"
): Promise<EventOrder[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filtered = [...eventOrdersData];

  // Filter by status
  if (filter.status && filter.status !== "semua") {
    filtered = filtered.filter((order) => order.status === filter.status);
  }

  // Filter by search
  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    filtered = filtered.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.eventTitle.toLowerCase().includes(searchLower)
    );
  }

  // Filter by date range
  if (filter.dateFrom || filter.dateTo) {
    // Date filtering logic can be implemented here
    // For now, just return filtered results
  }

  return filtered;
}

/**
 * Cancel event order
 */
export async function cancelEventOrder(
  orderNumber: string,
  userId: string = "user-1"
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const orderIndex = eventOrdersData.findIndex(
      (o) => o.orderNumber === orderNumber
    );

    if (orderIndex === -1) {
      return { success: false, error: "Order not found" };
    }

    // Check if order can be cancelled
    if (eventOrdersData[orderIndex].status === "selesai") {
      return {
        success: false,
        error: "Cannot cancel completed event",
      };
    }

    // In real app, this would update the database
    // For mock, we can just return success
    return {
      success: true,
      message: "Event order cancelled successfully",
    };
  } catch (error) {
    return { success: false, error: "Failed to cancel order" };
  }
}
