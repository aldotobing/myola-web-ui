/** @format */

// types/event.ts

export interface EventItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export type EventStatus = "semua" | "aktif" | "sedang_diproses" | "selesai";

export interface EventOrder {
  id: string;
  orderNumber: string;
  eventTitle: string;
  eventDate: string; // Format: "Sabtu, 18 Des 2025 - 20.34"
  orderDate: string; // Format: "Sabtu, 18 Des 2025 - 20.34"
  status: EventStatus;
  statusText: string;
  items: EventItem[];

  // Customer Info
  customerName: string;
  customerPhone: string;
  customerEmail: string;

  // Payment Info
  paymentMethod: string;
  subtotal: number;
  redeemPoints: number;
  totalPayment: number;

  // E-ticket Info
  hasETicket: boolean;
  eTicketSent: boolean;
  eTicketUrl?: string;
}

export interface EventCategory {
  id: string;
  name: string;
  count: number;
}

export interface EventFilter {
  status?: EventStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
