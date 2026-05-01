import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiHeart, FiShare2, FiTruck, FiShield } from 'react-icons/fi';
import axiosInstance from '../../api/axiosInstance';
import PageWrapper from '../../components/layout/PageWrapper';
import SimilarProducts from '../../components/product/SimilarProducts';
import RecommendedProducts from '../../components/product/RecommendedProducts';
import ShareModal from '../../components/ui/ShareModal';
import toast from 'react-hot-toast';
import OptimizedImage from '../../components/ui/OptimizedImage';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import useAuthStore from '../../store/authStore';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const { addToCart, isLoading: isAddingToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { user } = useAuthStore();

  // Fetch product data
  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await axiosInstance.get(`/products/${slug}`);
      return res.data.data;
    },
  });

  const product = data;

  // Once product loads, infer available unique sizes/colors from variants
  const availableSizes = product ? [...new Set(product.variants?.map(v => v.size).filter(Boolean))] : [];
  const availableColors = product ? [...new Set(product.variants?.map(v => v.color).filter(Boolean))] : [];

  const handleAddToCart = async () => {
    if (availableSizes.length > 0 && !selectedSize) {
      return toast.error('Please select a size');
    }
    if (availableColors.length > 0 && !selectedColor) {
      return toast.error('Please select a color');
    }

    // Check if selected variant is in stock
    const variantMatch = product.variants?.find(
      v => v.size === selectedSize && v.color === selectedColor
    );

    if (variantMatch && variantMatch.stock <= 0) {
      return toast.error('This combination is out of stock');
    }

    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await addToCart({
        productId: product._id,
        quantity: 1,
        size: selectedSize || undefined,
        color: selectedColor || undefined
      });
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  const handleToggleWishlist = () => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }
    toggleWishlist(product);
  };

  const handleShare = async () => {
    if (navigator.share && product) {
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

    setIsShareOpen(true);
  };

  const inWishlist = product ? isInWishlist(product._id) : false;

  if (isLoading) {
    return (
      <PageWrapper className="justify-center items-center">
        <div className="w-10 h-10 border-4 border-rose-brand border-t-transparent rounded-full animate-spin"></div>
      </PageWrapper>
    );
  }

  if (isError || !product) {
    return (
      <PageWrapper className="justify-center items-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </PageWrapper>
    );
  }

  const images = product.images?.length > 0
    ? product.images
    : [{ url: 'https://via.placeholder.com/800x1000?text=No+Image' }];

  return (
    <PageWrapper>
      <div className="container-main py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-ink-muted mb-8">
          <Link to="/shop" className="hover:text-rose-brand transition flex items-center gap-1">
            <FiChevronLeft /> Back to Shop
          </Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-ink">{product.category}</Link>
          <span>/</span>
          <span className="text-ink font-medium">{product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

          {/* Left: Image Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col lg:flex-row gap-6">
            
            {/* Desktop Thumbnails (Hidden on Mobile/Tablet) */}
            <div className="hidden lg:flex flex-col gap-4 w-24 flex-shrink-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? 'border-rose-brand shadow-lg scale-105' : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'
                    }`}
                >
                  <OptimizedImage src={img.url} alt="thumbnail" width={100} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Mobile/Tablet Carousel + Desktop Main Image */}
            <div className="flex-1 relative group">
              {/* Main Display (Desktop) / Slider (Mobile) */}
              <div 
                className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-cream-100 lg:shadow-2xl shadow-ink/5"
              >
                {/* Mobile Slider Logic (Native Scroll Snap) */}
                <div 
                  className="lg:hidden flex overflow-x-auto snap-x snap-mandatory h-full no-scrollbar"
                  onScroll={(e) => {
                    const index = Math.round(e.target.scrollLeft / e.target.offsetWidth);
                    if (index !== activeImage) setActiveImage(index);
                  }}
                >
                  {images.map((img, idx) => (
                    <div key={idx} className="w-full h-full flex-shrink-0 snap-center">
                      <OptimizedImage
                        src={img.url}
                        alt={`${product.name} ${idx + 1}`}
                        width={800}
                        priority={idx === 0}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Desktop Animated Display */}
                <div className="hidden lg:block h-full w-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImage}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: "circOut" }}
                      className="h-full w-full"
                    >
                      <OptimizedImage
                        src={images[activeImage].url}
                        alt={product.name}
                        width={800}
                        priority
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Mobile Pagination Dots */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 lg:hidden">
                  {images.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeImage === idx ? 'w-8 bg-white shadow-sm' : 'w-1.5 bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-ink mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6 text-sm">
              <div className="flex text-yellow-500">
                {'★'.repeat(Math.round(product.averageRating || 5))}
                {'☆'.repeat(5 - Math.round(product.averageRating || 5))}
              </div>
              <span className="text-ink-muted underline cursor-pointer hover:text-ink">
                {product.numOfReviews || 5} Reviews
              </span>
            </div>

            <div className="flex items-end gap-4 mb-6">
              <span className="text-2xl sm:text-3xl font-bold text-ink">₹{product.price?.toLocaleString('en-IN') || 'N/A'}</span>
              {product.msrp && product.msrp > product.price && (
                <span className="text-lg text-ink-muted line-through mb-1">₹{product.msrp?.toLocaleString('en-IN')}</span>
              )}
            </div>

            <p className="text-ink-light leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="border-t border-cream-200 pt-8 mb-8 space-y-6">
              {/* Colors */}
              {availableColors.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-ink tracking-wide mb-3">Color: <span className="font-normal text-ink-muted">{selectedColor}</span></h3>
                  <div className="flex gap-3">
                    {availableColors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 transition-transform capitalize ${selectedColor === color ? 'border-ink scale-110' : 'border-transparent hover:scale-105 shadow-sm'
                          }`}
                        title={color}
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {availableSizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-ink tracking-wide">Size</h3>
                    <button className="text-xs text-ink-muted underline hover:text-ink">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {availableSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 flex items-center justify-center border rounded-lg font-medium transition-all ${selectedSize === size
                          ? 'bg-ink text-white border-ink'
                          : 'bg-white text-ink border-cream-300 hover:border-ink'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 mb-10">
              <button
                onClick={handleAddToCart}
                disabled={product.totalStock <= 0 || isAddingToCart}
                className={`w-full sm:flex-1 btn-primary py-3.5 sm:py-4 text-base sm:text-lg order-1 sm:order-none ${product.totalStock > 0 && !isAddingToCart ? 'animate-pulse-once' : ''} ${isAddingToCart ? 'opacity-70 cursor-wait' : ''}`}
              >
                {isAddingToCart ? 'Adding...' : product.totalStock > 0 ? 'Add to Cart' : 'Sold Out'}
              </button>
              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto order-2 sm:order-none">
                <button
                  onClick={handleToggleWishlist}
                  className={`flex-1 sm:flex-none sm:w-14 h-12 sm:h-14 flex items-center justify-center rounded-lg border transition ${inWishlist ? 'border-rose-brand text-rose-brand' : 'border-cream-300 text-ink hover:text-rose-brand hover:border-cream-300'} bg-white hover:bg-cream-100`}
                >
                  <FiHeart size={20} className={inWishlist ? "fill-rose-brand" : ""} />
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 sm:flex-none sm:w-14 h-12 sm:h-14 flex items-center justify-center rounded-lg border border-cream-300 text-ink hover:text-rose-brand hover:border-cream-300 bg-white transition hover:bg-cream-100"
                >
                  <FiShare2 size={20} />
                </button>
              </div>
            </div>

            {/* Guarantees */}
            <div className="bg-cream-50 p-6 rounded-xl flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <FiTruck className="text-rose-brand" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Free Express Shipping</p>
                  <p className="text-xs text-ink-muted mt-0.5">Delivery in 2-4 business days.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <FiShield className="text-rose-brand" />
                </div>
                <div>
                  <p className="font-semibold text-sm">14-Day Free Returns</p>
                  <p className="text-xs text-ink-muted mt-0.5">Not perfect? Return it easily.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Similar Products */}
        <SimilarProducts productId={product._id} category={product.category} />

        {/* AI Recommendations */}
        <RecommendedProducts categoryContext={product.category} />

        {/* Share Modal */}
        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          product={product}
        />
      </div>
    </PageWrapper>
  );
}
