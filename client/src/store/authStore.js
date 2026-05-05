import { create } from 'zustand';
import authApi from '../api/authApi';
import toast from 'react-hot-toast';
import useCartStore from './cartStore';

const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  setUser: (user) => set({ user }),

  login: async (credentials) => {
    try {
      set({ isLoading: true });
      const res = await authApi.login(credentials);
      set({ user: res.data.data });
      
      // Sync guest cart to server
      await useCartStore.getState().syncCartWithServer();

      toast.success('Welcome back! 👋');
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (userData) => {
    try {
      set({ isLoading: true });
      const res = await authApi.register(userData);
      set({ user: res.data.data });

      // Sync guest cart to server
      await useCartStore.getState().syncCartWithServer();

      toast.success('Account created successfully! 🎉');
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  firebaseLogin: async (idToken) => {
    try {
      set({ isLoading: true });
      const res = await authApi.firebaseLogin({ idToken });
      set({ user: res.data.data });

      await useCartStore.getState().syncCartWithServer();

      if (res.data.data.isNewUser) {
        toast.success('Account created! Welcome to Aivana! 🎉');
      } else {
        toast.success('Welcome back! 👋');
      }
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Phone login failed';
      toast.error(msg);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    const { user } = get();
    try {
      await authApi.logout();
      set({ user: null });
      // Clear cart locally
      useCartStore.setState({ cart: { items: [], totalPrice: 0 } });

      if (user) {
        toast.success('Logged out successfully');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      set({ user: null });
      useCartStore.setState({ cart: { items: [], totalPrice: 0 } });
    }
  },

  fetchMe: async () => {
    try {
      set({ isLoading: true });
      const res = await authApi.getMe();
      set({ user: res.data.data, isInitialized: true });
    } catch (error) {
      set({ user: null, isInitialized: true });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
