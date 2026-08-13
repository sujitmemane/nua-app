import { create } from 'zustand';

import { eventsService } from '@/features/events/services/events-service';
import type { Product } from '@/features/products/types';
import { getDiscountedPrice } from '@/utils';

import type { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  increment: (productId: number) => void;
  decrement: (productId: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product, quantity = 1) => {
    const qty = Math.max(1, quantity);
    const existing = get().items.find((item) => item.productId === product.id);

    if (existing) {
      set({
        items: get().items.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + qty } : item
        ),
      });
    } else {
      set({
        items: [
          ...get().items,
          {
            productId: product.id,
            title: product.title,
            thumbnail: product.thumbnail,
            price: product.price,
            discountPercentage: product.discountPercentage,
            quantity: qty,
          },
        ],
      });
    }

    eventsService.addToCart({
      productId: product.id,
      title: product.title,
      quantity: qty,
      price: product.price,
    });
  },

  increment: (productId) => {
    const existing = get().items.find((item) => item.productId === productId);
    set({
      items: get().items.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
      ),
    });
    eventsService.addToCart({
      productId,
      title: existing?.title,
      quantity: 1,
    });
  },

  decrement: (productId) => {
    const existing = get().items.find((item) => item.productId === productId);
    if (!existing) return;

    if (existing.quantity <= 1) {
      set({ items: get().items.filter((item) => item.productId !== productId) });
      return;
    }

    set({
      items: get().items.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item
      ),
    });
  },

  removeItem: (productId) => {
    set({ items: get().items.filter((item) => item.productId !== productId) });
  },

  clear: () => set({ items: [] }),
}));

export function selectCartCount(state: CartState) {
  return state.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function selectCartSubtotal(state: CartState) {
  return state.items.reduce(
    (sum, item) => sum + getDiscountedPrice(item.price, item.discountPercentage) * item.quantity,
    0
  );
}


export function selectCartActualPrice(state: CartState) {
  return state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
}

export function selectItemQuantity(productId: number) {
  return (state: CartState) =>
    state.items.find((item) => item.productId === productId)?.quantity ?? 0;
}
