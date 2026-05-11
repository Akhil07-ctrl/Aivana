import { useState, useEffect } from 'react';
import { FiHeart, FiSearch, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../../components/layout/PageWrapper';
import useWishlistStore from '../../store/wishlistStore';
import ProductCard from '../../components/product/ProductCard';
import axiosInstance from '../../api/axiosInstance';

export default function WishlistPage() {
  const { items, setItems } = useWishlistStore();
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync wishlist with server on mount
  useEffect(() => {
    if (items.length > 0) {
      const syncWishlist = async () => {
        setIsSyncing(true);
        try {
          const ids = items.map(item => item._id).join(',');
          const res = await axiosInstance.get('/products', { params: { ids, limit: 100 } });
          const freshProducts = res.data.data.products || [];

          if (freshProducts.length !== items.length || JSON.stringify(freshProducts) !== JSON.stringify(items)) {
            setItems(freshProducts);
          }
        } catch (error) {
          console.error('Wishlist sync failed:', error);
        } finally {
          setIsSyncing(false);
        }
      };
      syncWishlist();
    }
  }, []);

  return (
    <PageWrapper className="bg-cream-50 pt-10 pb-24 min-h-screen">
      <div className="container-main max-w-6xl">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-display text-4xl font-bold text-ink">My Wishlist</h1>
          {isSyncing && (
            <div className="flex items-center gap-2 text-rose-brand text-xs font-bold uppercase tracking-widest">
              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Syncing
            </div>
          )}
        </div>
        <p className="text-ink-muted mb-10 text-lg">Your curated collection of premium styles.</p>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-12 lg:p-24 bg-white rounded-[2rem] border border-cream-200 shadow-sm text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.1, 1] }}
              transition={{ duration: 0.5 }}
              className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-8"
            >
              <FiHeart className="text-rose-brand w-12 h-12 fill-rose-brand/10" />
            </motion.div>
            <h3 className="text-3xl font-bold text-ink mb-3 font-display">Your wishlist is empty</h3>
            <p className="text-ink-muted mb-10 max-w-sm leading-relaxed">
              Keep track of items you love by clicking the heart icon on any product. Build your dream collection today.
            </p>
            <Link to="/shop" className="btn-primary px-10 py-4 shadow-xl shadow-rose-brand/20">
              Discover Fashion
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {items.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
