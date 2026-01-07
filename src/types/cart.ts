/** @format */

// types/cart.ts

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  cashback: number;
  slug: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  totalItems: number;
}

export interface CheckoutData {
  items: CartItem[];
  subtotal: number;
  redeemPoints: number;
  totalPayment: number;
  ppn: number;
  shippingCost: number;
  shippingAddress?: {
    recipientName: string;
    phoneNumber: string;
    fullAddress: string;
    label: string;
  };
  useExistingAddress: boolean;
}
