import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import productApi from '../../api/productApi';
import ProductCard from '../../components/product/ProductCard';
import { FiArrowRight } from 'react-icons/fi';
import TrendingSlider from './TrendingSlider';

export default function FeaturedProducts() {
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['trending-products'],
    queryFn: async () => {
      const response = await productApi.getTrendingProducts(4);
      return response.data.data.products || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes — homepage data changes rarely
  });

  if (isLoading) {
    return (
      <section className="py-24 bg-white">
        <div className="container-main">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display text-4xl text-ink font-bold mb-3">Trending Now</h2>
              <p className="text-ink-muted">Curated picks for the current season.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] rounded-xl bg-gray-200 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || products.length === 0) {
    return null; // Silent fail - don't show section if no products
  }

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-center md:text-left">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-rose-brand text-[10px] font-bold uppercase tracking-[0.2em] block mb-4"
            >
              Trending
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl lg:text-5xl text-ink font-bold"
            >
              Trending Now
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-center md:justify-end"
          >
            <Link
              to="/shop"
              className="group flex items-center gap-3 font-bold text-ink hover:text-rose-brand transition-colors border-b-2 border-cream-200 pb-1 hover:border-rose-brand"
            >
              View All Products
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Mobile/Tablet Slider */}
        <TrendingSlider products={products} />

      </div>
    </section>
  );
}
