import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiHeart, FiShare2, FiTruck, FiShield } from 'react-icons/fi';
import axiosInstance from '../../api/axiosInstance';
import PageWrapper from '../../components/layout/PageWrapper';
import RecommendedProducts from '../../components/product/RecommendedProducts';
import toast from 'react-hot-toast';
import useCartStore from '../../store/cartStore';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const { addToCart, isLoading: isAddingToCart } = useCartStore();

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

  const handleAddToCart = () => {
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

    addToCart({
      productId: product._id,
      quantity: 1,
      size: selectedSize || undefined,
      color: selectedColor || undefined
    });
  };

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
          <div className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible w-full md:w-24 flex-shrink-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-rose-brand' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                >
                  <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-cream-100 relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={images[activeImage].url}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6 text-sm">
              <div className="flex text-yellow-500">
                {'★'.repeat(Math.round(product.averageRating || 5))}
                {'☆'.repeat(5 - Math.round(product.averageRating || 5))}
              </div>
              <span className="text-ink-muted underline cursor-pointer hover:text-ink">
                {product.numOfReviews || 5} Revies
              </span>
            </div>

            <div className="flex items-end gap-4 mb-6">
              <span className="text-3xl font-bold text-ink">${product.price.toFixed(2)}</span>
              {product.msrp && product.msrp > product.price && (
                <span className="text-lg text-ink-muted line-through mb-1">${product.msrp.toFixed(2)}</span>
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
            <div className="flex gap-4 mb-10">
              <button
                onClick={handleAddToCart}
                disabled={product.totalStock <= 0 || isAddingToCart}
                className={`flex-1 btn-primary py-4 text-lg ${product.totalStock > 0 && !isAddingToCart ? 'animate-pulse-once' : ''} ${isAddingToCart ? 'opacity-70 cursor-wait' : ''}`}
              >
                {isAddingToCart ? 'Adding...' : product.totalStock > 0 ? 'Add to Cart' : 'Sold Out'}
              </button>
              <button className="w-14 h-14 flex items-center justify-center rounded-lg border border-cream-300 text-ink hover:text-rose-brand hover:border-cream-300 bg-white transition hover:bg-cream-100">
                <FiHeart size={20} />
              </button>
              <button className="w-14.h-14 flex items-center justify-center rounded-lg border border-cream-300 text-ink hover:text-rose-brand hover:border-cream-300 bg-white transition hover:bg-cream-100">
                <FiShare2 size={20} />
              </button>
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

        {/* AI Recommendations */}
        <RecommendedProducts categoryContext={product.category} />
      </div>
    </PageWrapper>
  );
}
