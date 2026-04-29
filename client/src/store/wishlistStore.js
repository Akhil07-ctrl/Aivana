import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (product) => {
        const currentItems = get().items;
        const exists = currentItems.find(item => item._id === product._id);

        if (exists) {
          set({ items: currentItems.filter(item => item._id !== product._id) });
          toast.success('Removed from Wishlist');
        } else {
          set({ items: [...currentItems, product] });
          toast.success('Added to Wishlist! ❤️');
        }
      },
      isInWishlist: (productId) => {
        return !!get().items.find(item => item._id === productId);
      },
      clearWishlist: () => set({ items: [] })
    }),
    {
      name: 'aivana-wishlist',
    }
  )
);

export default useWishlistStore;
