/** @format */

// contexts/CartContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Cart } from "@/types/cart";

interface CartContextType {
  cart: Cart;
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalCashback: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({
    items: [],
    subtotal: 0,
    totalItems: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("myola_cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("myola_cart", JSON.stringify(cart));
  }, [cart]);

  // Calculate cart totals
  const calculateTotals = (items: CartItem[]) => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, totalItems };
  };

  const addToCart = (item: Omit<CartItem, "id">) => {
    setCart((prevCart) => {
      // Check if item already exists
      const existingItemIndex = prevCart.items.findIndex(
        (i) => i.productId === item.productId
      );

      let newItems: CartItem[];

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        newItems = [...prevCart.items];
        newItems[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item
        const newItem: CartItem = {
          ...item,
          id: `cart-${Date.now()}-${Math.random()}`,
        };
        newItems = [...prevCart.items, newItem];
      }

      const { subtotal, totalItems } = calculateTotals(newItems);

      return {
        items: newItems,
        subtotal,
        totalItems,
      };
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item.id !== itemId);
      const { subtotal, totalItems } = calculateTotals(newItems);

      return {
        items: newItems,
        subtotal,
        totalItems,
      };
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      const { subtotal, totalItems } = calculateTotals(newItems);

      return {
        items: newItems,
        subtotal,
        totalItems,
      };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      subtotal: 0,
      totalItems: 0,
    });
  };

  const getTotalCashback = () => {
    return cart.items.reduce(
      (sum, item) => sum + item.cashback * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalCashback,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
