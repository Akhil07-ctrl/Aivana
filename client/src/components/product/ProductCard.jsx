import { useState, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShare2 } from 'react-icons/fi';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import { triggerShare } from '../ui/ShareModal';
import OptimizedImage from '../ui/OptimizedImage';
import { useRef } from 'react';
import { triggerFlyToCart } from '../ui/FlyToCart';

const ProductCard = memo(function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const productImageRef = useRef(null);

  const primaryImage = product.images?.find(img => img.isPrimary)?.url
    || product.images?.[0]?.url
    || 'https://via.placeholder.com/400x500?text=No+Image';

  const isOutOfStock = product.totalStock <= 0;
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      // Trigger fly-to-cart animation
      if (productImageRef.current) {
        const rect = productImageRef.current.getBoundingClientRect();
        triggerFlyToCart(
          primaryImage,
          rect.left + rect.width / 2,
          rect.top + rect.height / 2
        );
      }

      await addToCart({
        productId: product._id,
        quantity: 1,
        size: product.variants?.[0]?.size,
        color: product.variants?.[0]?.color,
        productData: product
      });
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }
    toggleWishlist(product);
  };

  const handleShare = async (e) => {
    e.preventDefault();

    if (navigator.share) {
      try {
        const productUrl = `${window.location.origin}/products/${product.slug}`;
        await navigator.share({
          title: product.name,
          text: `Check out this amazing product: ${product.name}`,
          url: productUrl
        });
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Direct share failed:', err);
        }
      }
    }

    triggerShare(product);
  };

  return (
    <motion.div
      className="group cursor-pointer flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-card-hover transition-shadow duration-300 overflow-hidden"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
      }}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      <Link to={`/products/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-cream-100 flex-shrink-0">
        <OptimizedImage
          ref={productImageRef}
          src={primaryImage}
          alt={product.name}
          width={400}
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

        {/* Hover Quick Action - Only for mouse devices */}
        {!isOutOfStock && (
          <div className="absolute inset-0 bg-ink/10 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 hidden lg:flex flex-col items-end justify-between p-4 pointer-events-none lg:group-hover:pointer-events-auto">
            <div className="flex gap-2">
              <button
                onClick={handleToggleWishlist}
                className={`w-11 h-11 bg-white rounded-full flex items-center justify-center transition-colors shadow-md ${inWishlist ? 'text-rose-brand' : 'text-ink hover:bg-rose-brand hover:text-white'}`}
                title="Wishlist"
              >
                <FiHeart size={20} className={inWishlist ? "fill-rose-brand" : ""} />
              </button>
              <button
                onClick={handleShare}
                className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-ink hover:bg-rose-brand hover:text-white transition-colors shadow-md"
                title="Share"
              >
                <FiShare2 size={20} />
              </button>
            </div>
            <button
              className="w-full bg-white text-ink py-3 rounded-lg font-semibold shadow-lg hover:bg-rose-brand hover:text-white transition-colors"
              onClick={handleAddToCart}
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
          <p className="text-ink font-bold text-lg">₹{product.price?.toLocaleString('en-IN') || 'N/A'}</p>
          {product.msrp && product.msrp > product.price && (
            <p className="text-ink-muted line-through text-sm">₹{product.msrp?.toLocaleString('en-IN')}</p>
          )}
        </div>
      </div>

    </motion.div>
  );
});

export default ProductCard;
