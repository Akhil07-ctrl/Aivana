import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiHeart, FiShare2, FiTruck, FiShield, FiStar } from 'react-icons/fi';
import axiosInstance from '../../api/axiosInstance';
import PageWrapper from '../../components/layout/PageWrapper';
import SimilarProducts from '../../components/product/SimilarProducts';
import ProductReviews from '../../components/product/ProductReviews';
import ShareModal from '../../components/ui/ShareModal';
import SizeGuideModal from '../../components/ui/SizeGuideModal';
import toast from 'react-hot-toast';
import OptimizedImage from '../../components/ui/OptimizedImage';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import useAuthStore from '../../store/authStore';
import { NO_SIZE_SUBCATEGORIES } from '../../constants/categories';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
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

  // Products like Bags, Watches, Jewelry don't need size selection or size guide
  const isNoSizeProduct = product ? NO_SIZE_SUBCATEGORIES.some(
    s => s.toLowerCase() === product.subcategory?.toLowerCase()
  ) : false;
  const showSizes = availableSizes.length > 0 && !isNoSizeProduct;

  // Check if a specific size has any stock
  const isSizeInStock = (size) => {
    if (!product?.variants) return false;
    return product.variants.some(v => v.size === size && v.stock > 0);
  };

  // Check if a specific color has any stock
  const isColorInStock = (color) => {
    if (!product?.variants) return false;
    return product.variants.some(v => v.color === color && v.stock > 0);
  };

  const handleAddToCart = async () => {
    if (showSizes && !selectedSize) {
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

    try {
      await addToCart({
        productId: product._id,
        quantity: 1,
        size: selectedSize || undefined,
        color: selectedColor || undefined,
        productData: {
          _id: product._id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          images: product.images,
        }
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
        <button onClick={() => navigate(-1)} className="btn-primary">Back to Shop</button>
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
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-ink-muted mb-6 md:mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
          <button
            onClick={() => navigate(-1)}
            className="hover:text-rose-brand transition flex items-center gap-1 flex-shrink-0"
          >
            <FiChevronLeft /> Back
          </button>
          <span className="opacity-40">/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-ink flex-shrink-0">{product.category}</Link>
          <span className="opacity-40">/</span>
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

                {/* Desktop Animated Display with Hover Zoom */}
                <div
                  className="hidden lg:block h-full w-full overflow-hidden cursor-crosshair"
                  onMouseMove={(e) => {
                    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - left) / width) * 100;
                    const y = ((e.clientY - top) / height) * 100;
                    e.currentTarget.lastChild.style.transformOrigin = `${x}% ${y}%`;
                    e.currentTarget.lastChild.style.transform = 'scale(2.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.lastChild.style.transformOrigin = 'center center';
                    e.currentTarget.lastChild.style.transform = 'scale(1)';
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="h-full w-full transition-transform duration-200 ease-out"
                      style={{ transformOrigin: 'center center', transform: 'scale(1)' }}
                    >
                      <OptimizedImage
                        src={images[activeImage].url}
                        alt={product.name}
                        width={800}
                        priority
                        className="w-full h-full object-cover pointer-events-none"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Mobile Pagination Dots */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 lg:hidden">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${activeImage === idx ? 'w-8 bg-white shadow-sm' : 'w-1.5 bg-white/40'
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

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100 shadow-sm">
                <div className="flex text-yellow-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <FiStar key={s} className={s <= Math.round(product.averageRating || 0) ? 'fill-yellow-500' : 'text-yellow-200'} size={14} />
                  ))}
                </div>
                <span className="text-sm font-bold text-ink ml-1">{product.averageRating?.toFixed(1) || '0.0'}</span>
              </div>
              <button
                onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm font-bold text-ink-muted hover:text-rose-brand transition-colors flex items-center gap-2 group"
              >
                <div className="w-1 h-1 bg-cream-400 rounded-full" />
                <span className="underline decoration-cream-300 underline-offset-4 group-hover:decoration-rose-brand">
                  {product.numOfReviews || 0} Customer Reviews
                </span>
              </button>
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
                    {availableColors.map(color => {
                      const inStock = isColorInStock(color);
                      return (
                        <button
                          key={color}
                          onClick={() => inStock && setSelectedColor(color)}
                          disabled={!inStock}
                          className={`relative w-10 h-10 rounded-full border-2 transition-transform capitalize ${!inStock
                            ? 'opacity-30 cursor-not-allowed border-transparent'
                            : selectedColor === color
                              ? 'border-ink scale-110'
                              : 'border-transparent hover:scale-105 shadow-sm'
                            }`}
                          title={inStock ? color : `${color} - Out of stock`}
                          style={{ backgroundColor: color.toLowerCase() }}
                        >
                          {!inStock && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="block w-full h-0.5 bg-red-500 rotate-45 rounded-full" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {showSizes && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-ink tracking-wide">Size</h3>
                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="flex items-center gap-1.5 text-xs font-bold text-rose-brand hover:text-rose-dark transition-colors px-3 py-1.5 bg-rose-brand/5 rounded-full border border-rose-brand/10"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 15.5H13M9 13H15M7 10.5H17M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                      </svg>
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {availableSizes.map(size => {
                      const inStock = isSizeInStock(size);
                      return (
                        <button
                          key={size}
                          onClick={() => inStock && setSelectedSize(size)}
                          disabled={!inStock}
                          className={`relative w-12 h-12 flex items-center justify-center border rounded-lg font-medium transition-all overflow-hidden ${!inStock
                            ? 'bg-cream-50 text-ink-muted/40 border-cream-200 cursor-not-allowed'
                            : selectedSize === size
                              ? 'bg-ink text-white border-ink'
                              : 'bg-white text-ink border-cream-300 hover:border-ink'
                            }`}
                        >
                          {size}
                          {!inStock && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="block w-[140%] h-px bg-ink-muted/40 rotate-45" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Out of Stock Banner */}
            {product.totalStock <= 0 && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-red-700 text-sm">Currently Out of Stock</p>
                  <p className="text-xs text-red-500 mt-0.5">This item is temporarily unavailable. Check back soon!</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 mb-10">
              <button
                onClick={handleAddToCart}
                disabled={product.totalStock <= 0 || isAddingToCart}
                className={`w-full sm:flex-1 py-3.5 sm:py-4 text-base sm:text-lg order-1 sm:order-none rounded-xl font-bold transition-all ${product.totalStock <= 0
                  ? 'bg-cream-200 text-ink-muted cursor-not-allowed'
                  : isAddingToCart
                    ? 'btn-primary opacity-70 cursor-wait'
                    : 'btn-primary'
                  }`}
              >
                {isAddingToCart ? 'Adding...' : product.totalStock > 0 ? 'Add to Cart' : 'Out of Stock'}
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

        {/* Reviews Section */}
        <div id="reviews-section">
          <ProductReviews
            productId={product._id}
            averageRating={product.averageRating}
            numOfReviews={product.numOfReviews}
          />
        </div>

        {/* Similar Products */}
        <SimilarProducts productId={product._id} category={product.category} />

        {/* Share Modal */}
        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          product={product}
        />

        {/* Size Guide Modal */}
        <SizeGuideModal
          isOpen={isSizeGuideOpen}
          onClose={() => setIsSizeGuideOpen(false)}
          subcategory={product.subcategory}
        />
      </div>
    </PageWrapper>
  );
}
