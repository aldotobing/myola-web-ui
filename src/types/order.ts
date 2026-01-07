/** @format */

// types/order.ts
export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  cashback: number;
}

export interface OrderNotification {
  type: "info" | "success";
  message: string;
}

export type OrderStatus = "sedang_diproses" | "sedang_dikirim" | "selesai";

export interface Order {
  id: number;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  statusText: string;
  items: OrderItem[];
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  address: string;
  paymentMethod: string;
  subtotal: number;
  redeemPoints: number;
  totalPayment: number;
  ppn: number;
  shippingCost: number;
  notification?: OrderNotification;
  deliveryProof?: string;
}
