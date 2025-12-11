"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { CartItem } from "@/types";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (documentId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.documentId === item.documentId);
      if (existingItem) {
        return prevItems;
      }
      return [...prevItems, item];
    });
  }, []);

  const removeItem = useCallback((documentId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.documentId !== documentId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + item.price, 0);
  }, [items]);

  const getItemCount = useCallback(() => {
    return items.length;
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        getTotalPrice,
        getItemCount,
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
