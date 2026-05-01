import { create } from 'zustand';
import authApi from '../api/authApi';
import toast from 'react-hot-toast';

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

  logout: async () => {
    const { user } = get();
    try {
      await authApi.logout();
      set({ user: null });
      if (user) {
        toast.success('Logged out successfully');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear user on client side
      set({ user: null });
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
