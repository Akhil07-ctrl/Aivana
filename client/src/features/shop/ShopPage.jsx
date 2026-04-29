import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter } from 'react-icons/fi';
import axiosInstance from '../../api/axiosInstance';
import PageWrapper from '../../components/layout/PageWrapper';
import ProductCard from '../../components/product/ProductCard';
import FilterSidebar from './FilterSidebar';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // States derived from URL or default
  const currentCategory = searchParams.get('category') || '';
  const currentSort     = searchParams.get('sort') || 'newest';
  const currentPage     = parseInt(searchParams.get('page') || '1', 10);

  // Keep URL in sync
  const updateParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    
    // Reset page to 1 on filter/sort change
    if (key !== 'page') newParams.set('page', '1');
    
    setSearchParams(newParams);
  };

  // Fetch products from backend
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', currentCategory, currentSort, currentPage],
    queryFn: async () => {
      const res = await axiosInstance.get('/products', {
        params: {
          category: currentCategory,
          sort: currentSort,
          page: currentPage,
          limit: 12
        }
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const products = data?.data?.products || [];
  const totalPages = data?.data?.totalPages || 1;

  return (
    <PageWrapper>
      {/* Shop Header */}
      <div className="bg-cream-50 border-b border-cream-200 py-12 lg:py-16">
        <div className="container-main text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl lg:text-5xl font-bold text-ink mb-4"
          >
            {currentCategory ? `${currentCategory} Collection` : 'All Products'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-ink-muted max-w-xl mx-auto"
          >
            Discover our carefully curated selection of premium fashion items, designed to elevate your personal style.
          </motion.p>
        </div>
      </div>

      {/* Main Shop Content */}
      <div className="container-main py-12 flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar (Desktop + Mobile overlay handled inside) */}
        <FilterSidebar 
          currentCategory={currentCategory} 
          setCategory={(val) => updateParams('category', val)}
          currentSort={currentSort}
          setSort={(val) => updateParams('sort', val)}
          isMobileOpen={mobileFiltersOpen}
          closeMobile={() => setMobileFiltersOpen(false)}
        />

        {/* Product Grid Area */}
        <div className="flex-1">
          {/* Mobile filter toggle */}
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <span className="text-sm font-semibold text-ink-muted">
              {data?.data?.totalProducts || 0} products found
            </span>
            <button 
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 btn-outline px-4 py-2 text-sm"
            >
              <FiFilter /> Filters
            </button>
          </div>

          <div className="hidden lg:block mb-8 text-sm font-medium text-ink-muted border-b border-cream-200 pb-4">
            Showing {products.length} of {data?.data?.totalProducts || 0} products
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse flex flex-col gap-4">
                  <div className="bg-cream-200 aspect-[3/4] rounded-xl w-full" />
                  <div className="h-4 bg-cream-200 rounded w-1/3" />
                  <div className="h-5 bg-cream-200 rounded w-3/4" />
                  <div className="h-6 bg-cream-200 rounded w-1/4 mt-auto" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-red-100">
              <p className="text-red-500 font-semibold text-lg">Failed to load products.</p>
              <p className="text-ink-muted mt-2">Please try refreshing the page.</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-2xl border border-cream-200">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-display text-2xl font-bold text-ink mb-2">No products found</h3>
              <p className="text-ink-muted">Try adjusting your filters or category.</p>
              <button 
                onClick={() => { updateParams('category', ''); updateParams('search', ''); }}
                className="mt-6 btn-primary"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                <AnimatePresence mode="popLayout">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-16 border-t border-cream-200 pt-8">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => updateParams('page', String(i + 1))}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all ${
                        currentPage === i + 1 
                          ? 'bg-ink text-white' 
                          : 'bg-cream-100 text-ink-muted hover:bg-cream-200 hover:text-ink'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
