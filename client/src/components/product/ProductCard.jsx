import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  const primaryImage = product.images?.find(img => img.isPrimary)?.url
    || product.images?.[0]?.url
    || 'https://via.placeholder.com/400x500?text=No+Image';

  const isOutOfStock = product.totalStock <= 0;

  return (
    <motion.div
      className="group cursor-pointer flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-card-hover transition-shadow duration-300 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
    >
      <Link to={`/products/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-cream-100 flex-shrink-0">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.msrp && product.msrp > product.price && (
            <span className="badge-rose">Sale</span>
          )}
          {isOutOfStock && (
            <span className="badge bg-ink text-white">Sold Out</span>
          )}
        </div>

        {/* Hover Quick Action */}
        {!isOutOfStock && (
          <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product);
              }}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-ink hover:bg-rose-brand hover:text-white transition-colors shadow-sm"
              title="Wishlist"
            >
              <FiHeart className={isInWishlist(product._id) ? "fill-rose-brand text-rose-brand" : ""} />
            </button>
            <button
              className="flex-1 bg-white text-ink py-2.5 rounded-lg font-semibold shadow-lg hover:bg-rose-brand hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
                toast.success('Added to cart');
              }}
            >
              Add to Cart
            </button>
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2 mb-1">
          <p className="text-xs text-ink-muted uppercase tracking-wider font-medium line-clamp-1">
            {product.category}
          </p>
          <div className="flex items-center gap-1 text-xs font-semibold text-yellow-500">
            ★ {product.averageRating > 0 ? product.averageRating.toFixed(1) : 'New'}
          </div>
        </div>

        <Link to={`/products/${product.slug}`} className="block flex-1">
          <h3 className="font-semibold text-ink text-base mb-1 group-hover:text-rose-brand transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-3 mt-auto pt-2">
          <p className="text-ink font-bold text-lg">${product.price.toFixed(2)}</p>
          {product.msrp && product.msrp > product.price && (
            <p className="text-ink-muted line-through text-sm">${product.msrp.toFixed(2)}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
