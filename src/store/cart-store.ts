import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';
import { MAX_CART_QUANTITY } from '@/lib/constants';

/**
 * Interface del estado del carrito
 */
interface CartState {
  items: CartItem[];
  isOpen: boolean;
  
  // Acciones del carrito
  addItem: (product: Product, quantity: number, size: string, color: string) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  
  // Control del drawer
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // Getters computados
  getItemCount: () => number;
  getSubtotal: () => number;
  getItemKey: (productId: string, size: string, color: string) => string;
  findItem: (productId: string, size: string, color: string) => CartItem | undefined;
}

/**
 * Store del carrito de compras con persistencia en localStorage
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      getItemKey: (productId: string, size: string, color: string) => {
        return `${productId}-${size}-${color}`;
      },

      findItem: (productId: string, size: string, color: string) => {
        return get().items.find(
          (item) =>
            item.productId === productId &&
            item.size === size &&
            item.color === color
        );
      },

      addItem: (product: Product, quantity: number, size: string, color: string) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.productId === product.id &&
              item.size === size &&
              item.color === color
          );

          if (existingItem) {
            const newQuantity = Math.min(
              existingItem.quantity + quantity,
              MAX_CART_QUANTITY
            );
            
            return {
              items: state.items.map((item) =>
                item.productId === product.id &&
                item.size === size &&
                item.color === color
                  ? { ...item, quantity: newQuantity }
                  : item
              ),
              isOpen: true,
            };
          }

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                product,
                quantity: Math.min(quantity, MAX_CART_QUANTITY),
                size,
                color,
              },
            ],
            isOpen: true,
          };
        });
      },

      removeItem: (productId: string, size: string, color: string) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.size === size &&
                item.color === color
              )
          ),
        }));
      },

      updateQuantity: (
        productId: string,
        size: string,
        color: string,
        quantity: number
      ) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId &&
            item.size === size &&
            item.color === color
              ? { ...item, quantity: Math.min(quantity, MAX_CART_QUANTITY) }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'kuro-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
