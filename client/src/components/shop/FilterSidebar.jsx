import { useState, useEffect } from 'react';
import { FiX, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Dresses', 'Tops', 'Outerwear', 'Activewear', 'Accessories', 'Jewelry', 'Sale'];
const SORTS = [
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

export default function FilterSidebar({
  currentCategory,
  setCategory,
  currentSort,
  setSort,
  minPrice,
  maxPrice,
  setPriceRange,
  isMobileOpen,
  closeMobile,
  clearFilters
}) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [localMin, setLocalMin] = useState(minPrice || '');
  const [localMax, setLocalMax] = useState(maxPrice || '');

  useEffect(() => {
    setLocalMin(minPrice || '');
    setLocalMax(maxPrice || '');
  }, [minPrice, maxPrice]);

  const PRICE_BRACKETS = [
    { label: 'Under ₹500', min: '', max: '500' },
    { label: '₹500 - ₹1,000', min: '500', max: '1000' },
    { label: '₹1,000 - ₹2,000', min: '1000', max: '2000' },
    { label: 'Over ₹2,000', min: '2000', max: '' },
  ];
  const content = (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display font-bold text-2xl text-ink hidden lg:block">Filters</h2>
        <div className="flex items-center justify-between w-full lg:w-auto">
          <h2 className="font-display font-bold text-2xl text-ink lg:hidden">Filters</h2>
          <div className="flex items-center gap-4">
            {(currentCategory || minPrice || maxPrice || currentSort !== 'newest') && (
              <button 
                onClick={clearFilters} 
                className="text-sm font-semibold text-rose-brand hover:text-rose-700 transition-colors"
              >
                Clear All
              </button>
            )}
            <button onClick={closeMobile} className="lg:hidden p-2 -mr-2 text-ink-muted hover:text-rose-brand">
              <FiX size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Sort (Mobile friendly placement) */}
      <div>
        <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 border-b border-cream-200 pb-2">
          Sort By
        </h3>
        <div className="relative">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="w-full bg-cream-100 border-none rounded-lg p-3 text-ink text-sm flex justify-between items-center focus:ring-2 focus:ring-rose-brand outline-none transition-shadow"
          >
            <span className="font-medium">{SORTS.find(s => s.value === currentSort)?.label || 'Sort By'}</span>
            <FiChevronDown className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isSortOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-cream-200 rounded-xl shadow-xl z-20 overflow-hidden"
              >
                {SORTS.map(s => (
                  <button
                    key={s.value}
                    onClick={() => { setSort(s.value); setIsSortOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-cream-50 transition-colors ${currentSort === s.value ? 'font-bold text-rose-brand bg-rose-50/50' : 'text-ink'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 border-b border-cream-200 pb-2">
          Categories
        </h3>
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => setCategory('')}
              className={`text-sm tracking-wide transition-colors ${!currentCategory ? 'text-rose-brand font-semibold' : 'text-ink-light hover:text-ink'
                }`}
            >
              All Products
            </button>
          </li>
          {CATEGORIES.map(cat => (
            <li key={cat}>
              <button
                onClick={() => setCategory(cat)}
                className={`text-sm tracking-wide transition-colors ${currentCategory === cat ? 'text-rose-brand font-semibold' : 'text-ink-light hover:text-ink'
                  }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Placeholder for future filters */}
      <div>
        <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 border-b border-cream-200 pb-2">
          Price Range
        </h3>
        <div className="py-2">
          {/* Curated Price Brackets */}
          <div className="space-y-1">
            {PRICE_BRACKETS.map((bracket, idx) => {
              const isActive = minPrice === bracket.min && maxPrice === bracket.max;
              return (
                <button
                  key={idx}
                  onClick={() => setPriceRange(bracket.min, bracket.max)}
                  className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${isActive ? 'bg-rose-50 text-rose-brand font-semibold' : 'text-ink-light hover:bg-cream-50 hover:text-ink'}`}
                >
                  {bracket.label}
                  {isActive && <motion.div layoutId="activeFilter" className="w-1.5 h-1.5 rounded-full bg-rose-brand" />}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-[120px]">
          {content}
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm" onClick={closeMobile} />
          <div className="relative w-[85%] max-w-sm bg-white h-full p-6 overflow-y-auto shadow-2xl animate-slide-in-right ml-auto">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
