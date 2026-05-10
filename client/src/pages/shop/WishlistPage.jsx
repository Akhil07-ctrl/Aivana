import { FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import useWishlistStore from '../../store/wishlistStore';
import ProductCard from '../../components/product/ProductCard';

export default function WishlistPage() {
  const { items } = useWishlistStore();

  return (
    <PageWrapper className="bg-cream-50 pt-10 pb-24 min-h-screen">
      <div className="container-main max-w-6xl">
        <h1 className="font-display text-4xl font-bold text-ink mb-2">My Wishlist</h1>
        <p className="text-ink-muted mb-10">Save your favorite styles for later.</p>

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
