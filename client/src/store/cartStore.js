import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const useCartStore = create((set, get) => ({
  cart: null,
  isCartOpen: false,
  isLoading: false,

  setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get('/cart');
      set({ cart: res.data.data });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      // We don't toast here to avoid spamming if not logged in
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async ({ productId, quantity = 1, size, color }) => {
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
  },

  updateQuantity: async ({ productId, size, color, quantity }) => {
    try {
      const res = await axiosInstance.put('/cart/items', { productId, size, color, quantity });
      set({ cart: res.data.data });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    }
  },

  removeItem: async ({ productId, size, color }) => {
    try {
      const res = await axiosInstance.put('/cart/items', { productId, size, color, quantity: 0 });
      set({ cart: res.data.data });
      toast.success('Item removed');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  },

  clearCart: async () => {
    try {
      const res = await axiosInstance.delete('/cart');
      set({ cart: res.data.data });
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  }
}));

export default useCartStore;
