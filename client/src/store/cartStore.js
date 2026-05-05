import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import useAuthStore from './authStore';

// Helper to calculate total price for local cart
const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: { items: [], totalPrice: 0 },
      isCartOpen: false,
      isLoading: false,

      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

      fetchCart: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return; // Don't fetch if not logged in (rely on local storage)
        
        try {
          set({ isLoading: true });
          const res = await axiosInstance.get('/cart');
          set({ cart: res.data.data });
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      addToCart: async ({ productId, quantity = 1, size, color, productData }) => {
        const user = useAuthStore.getState().user;
        
        if (user) {
          try {
            set({ isLoading: true });
            const res = await axiosInstance.post('/cart/items', { productId, quantity, size, color });
            set({ cart: res.data.data, isCartOpen: true });
            toast.success('Added to your cart! 🛍️');
          } catch (error) {
            const msg = error.response?.data?.message || 'Failed to add to cart';
            toast.error(msg);
            throw error;
          } finally {
            set({ isLoading: false });
          }
        } else {
          // Local cart logic
          const { cart } = get();
          const items = [...(cart?.items || [])];
          
          const existingIndex = items.findIndex(
            (item) => item.product._id === productId && item.size === size && item.color === color
          );

          if (existingIndex > -1) {
            items[existingIndex].quantity += quantity;
          } else {
            items.push({
              product: productData || { _id: productId }, // Use productData for UI info
              quantity,
              size,
              color,
              price: productData?.price || 0
            });
          }

          set({ 
            cart: { items, totalPrice: calculateTotal(items) }, 
            isCartOpen: true 
          });
          toast.success('Added to your cart! 🛍️');
        }
      },

      updateQuantity: async ({ productId, size, color, quantity }) => {
        const user = useAuthStore.getState().user;
        
        if (user) {
          try {
            const res = await axiosInstance.put('/cart/items', { productId, size, color, quantity });
            set({ cart: res.data.data });
          } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update quantity');
          }
        } else {
          const { cart } = get();
          const items = [...(cart?.items || [])];
          const existingIndex = items.findIndex(
            (item) => item.product._id === productId && item.size === size && item.color === color
          );

          if (existingIndex > -1) {
            items[existingIndex].quantity = quantity;
            set({ cart: { items, totalPrice: calculateTotal(items) } });
          }
        }
      },

      removeItem: async ({ productId, size, color }) => {
        const user = useAuthStore.getState().user;

        if (user) {
          try {
            const res = await axiosInstance.put('/cart/items', { productId, size, color, quantity: 0 });
            set({ cart: res.data.data });
            toast.success('Item removed');
          } catch (error) {
            toast.error('Failed to remove item');
          }
        } else {
          const { cart } = get();
          const items = (cart?.items || []).filter(
            (item) => !(item.product._id === productId && item.size === size && item.color === color)
          );
          set({ cart: { items, totalPrice: calculateTotal(items) } });
          toast.success('Item removed');
        }
      },

      clearCart: async () => {
        const user = useAuthStore.getState().user;
        
        if (user) {
          try {
            const res = await axiosInstance.delete('/cart');
            set({ cart: res.data.data });
            toast.success('Cart cleared');
          } catch (error) {
            toast.error('Failed to clear cart');
          }
        } else {
          set({ cart: { items: [], totalPrice: 0 } });
          toast.success('Cart cleared');
        }
      },

      syncCartWithServer: async () => {
        const { cart } = get();
        if (!cart || !cart.items || cart.items.length === 0) {
          get().fetchCart();
          return;
        }
        
        try {
          const res = await axiosInstance.post('/cart/sync', { items: cart.items });
          set({ cart: res.data.data });
        } catch (error) {
          console.error('Failed to sync local cart with server', error);
          get().fetchCart(); // Fallback to fetching server cart
        }
      }
    }),
    {
      name: 'aivana-cart-storage',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);

export default useCartStore;
