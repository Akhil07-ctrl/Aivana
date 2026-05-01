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
          <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-cream-200 shadow-sm text-center">
            <div className="w-24 h-24 bg-cream-100 rounded-full flex items-center justify-center mb-6">
              <FiHeart className="text-rose-brand w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-ink mb-2">Your wishlist is empty</h3>
            <p className="text-ink-muted mb-8 max-w-sm">
              Keep track of items you love by clicking the heart icon on any product.
            </p>
            <Link to="/shop" className="btn-primary">
              Discover Fashion
            </Link>
          </div>
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
