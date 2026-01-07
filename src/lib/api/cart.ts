/** @format */
// lib/api/cart.ts

import { Cart, CartItem, CheckoutData } from "@/types/cart";

// Simulasi database/storage
const mockDatabase: { [key: string]: Cart } = {};

// Helper untuk generate ID unik
const generateId = () => Math.random().toString(36).substr(2, 9);

// Simulasi data produk untuk validasi
const mockProducts: { [key: string]: CartItem } = {
  "prod-001": {
    id: generateId(),
    productId: "prod-001",
    name: "Hair Color Cream Black Sugar",
    price: 299000,
    quantity: 0,
    image: "/images/product_1.png",
    cashback: 10000,
    slug: "hair-color-cream-black-sugar",
  },
  "prod-002": {
    id: generateId(),
    productId: "prod-002",
    name: "Hair Color Cream Purple Sugar",
    price: 56000,
    quantity: 0,
    image: "/images/product_2.png",
    cashback: 10000,
    slug: "hair-color-cream-purple-sugar",
  },
  "prod-003": {
    id: generateId(),
    productId: "prod-003",
    name: "Hair Color Cream Pink Sugar",
    price: 249000,
    quantity: 0,
    image: "/images/product_3.png",
    cashback: 24900,
    slug: "hair-color-cream-pink-sugar",
  },
};

// GET /api/cart - Ambil cart user
export async function getCart(userId: string): Promise<Cart> {
  // Simulasi delay API
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!mockDatabase[userId]) {
    mockDatabase[userId] = {
      items: [],
      subtotal: 0,
      totalItems: 0,
    };
  }

  return mockDatabase[userId];
}

// POST /api/cart - Tambah item ke cart
export async function addToCart(
  userId: string,
  productId: string,
  quantity: number
): Promise<{ success: boolean; cart?: Cart; error?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    // Validasi produk
    if (!mockProducts[productId]) {
      return {
        success: false,
        error: "Produk tidak ditemukan",
      };
    }

    // Validasi quantity
    if (quantity < 1) {
      return {
        success: false,
        error: "Quantity minimal 1",
      };
    }

    // Inisialisasi cart jika belum ada
    if (!mockDatabase[userId]) {
      mockDatabase[userId] = {
        items: [],
        subtotal: 0,
        totalItems: 0,
      };
    }

    const cart = mockDatabase[userId];
    const existingItem = cart.items.find(
      (item) => item.productId === productId
    );

    if (existingItem) {
      // Update quantity jika item sudah ada
      existingItem.quantity += quantity;
    } else {
      // Tambah item baru
      const newItem = {
        ...mockProducts[productId],
        id: generateId(),
        quantity,
      };
      cart.items.push(newItem);
    }

    // Recalculate cart totals
    updateCartTotals(cart);

    return {
      success: true,
      cart,
    };
  } catch (error) {
    return {
      success: false,
      error: "Gagal menambahkan ke cart",
    };
  }
}

// PUT /api/cart/:itemId - Update quantity item
export async function updateCartItem(
  userId: string,
  itemId: string,
  quantity: number
): Promise<{ success: boolean; cart?: Cart; error?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    if (!mockDatabase[userId]) {
      return {
        success: false,
        error: "Cart tidak ditemukan",
      };
    }

    const cart = mockDatabase[userId];
    const item = cart.items.find((i) => i.id === itemId);

    if (!item) {
      return {
        success: false,
        error: "Item tidak ditemukan di cart",
      };
    }

    if (quantity < 1) {
      return {
        success: false,
        error: "Quantity minimal 1",
      };
    }

    item.quantity = quantity;
    updateCartTotals(cart);

    return {
      success: true,
      cart,
    };
  } catch (error) {
    return {
      success: false,
      error: "Gagal update item cart",
    };
  }
}

// DELETE /api/cart/:itemId - Hapus item dari cart
export async function removeFromCart(
  userId: string,
  itemId: string
): Promise<{ success: boolean; cart?: Cart; error?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    if (!mockDatabase[userId]) {
      return {
        success: false,
        error: "Cart tidak ditemukan",
      };
    }

    const cart = mockDatabase[userId];
    const itemIndex = cart.items.findIndex((i) => i.id === itemId);

    if (itemIndex === -1) {
      return {
        success: false,
        error: "Item tidak ditemukan di cart",
      };
    }

    cart.items.splice(itemIndex, 1);
    updateCartTotals(cart);

    return {
      success: true,
      cart,
    };
  } catch (error) {
    return {
      success: false,
      error: "Gagal menghapus item dari cart",
    };
  }
}

// DELETE /api/cart - Clear seluruh cart
export async function clearCart(userId: string): Promise<{
  success: boolean;
  cart?: Cart;
  error?: string;
}> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    if (!mockDatabase[userId]) {
      return {
        success: false,
        error: "Cart tidak ditemukan",
      };
    }

    mockDatabase[userId] = {
      items: [],
      subtotal: 0,
      totalItems: 0,
    };

    return {
      success: true,
      cart: mockDatabase[userId],
    };
  } catch (error) {
    return {
      success: false,
      error: "Gagal clear cart",
    };
  }
}

// POST /api/cart/checkout - Process checkout
export async function processCheckout(
  userId: string,
  checkoutData: Omit<CheckoutData, "items" | "subtotal">
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    if (!mockDatabase[userId]) {
      return {
        success: false,
        error: "Cart tidak ditemukan",
      };
    }

    const cart = mockDatabase[userId];

    if (cart.items.length === 0) {
      return {
        success: false,
        error: "Cart kosong",
      };
    }

    // Validasi data checkout
    if (!checkoutData.shippingAddress && !checkoutData.useExistingAddress) {
      return {
        success: false,
        error: "Alamat pengiriman diperlukan",
      };
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 5)}`;

    // Simulasi proses order (dalam aplikasi nyata, ini disimpan ke database)
    console.log("Order processed:", {
      orderId,
      userId,
      items: cart.items,
      total: checkoutData.totalPayment,
      timestamp: new Date().toISOString(),
    });

    // Clear cart setelah checkout berhasil
    mockDatabase[userId] = {
      items: [],
      subtotal: 0,
      totalItems: 0,
    };

    return {
      success: true,
      orderId,
    };
  } catch (error) {
    return {
      success: false,
      error: "Gagal memproses checkout",
    };
  }
}

// Helper function untuk menghitung total
function updateCartTotals(cart: Cart): void {
  cart.subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

// Bonus: Get mock products untuk testing
export function getMockProducts() {
  return Object.values(mockProducts);
}
