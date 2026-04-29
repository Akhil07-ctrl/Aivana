import { FiX } from 'react-icons/fi';

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
  isMobileOpen,
  closeMobile
}) {
  const content = (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex items-center justify-between lg:hidden">
        <h2 className="font-display font-bold text-2xl text-ink">Filters</h2>
        <button onClick={closeMobile} className="p-2 text-ink-muted hover:text-rose-brand">
          <FiX size={24} />
        </button>
      </div>

      {/* Sort (Mobile friendly placement) */}
      <div>
        <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 border-b border-cream-200 pb-2">
          Sort By
        </h3>
        <select
          className="w-full bg-cream-100 border-none rounded-lg p-3 text-ink text-sm appearance-none focus:ring-2 focus:ring-rose-brand outline-none"
          value={currentSort}
          onChange={(e) => setSort(e.target.value)}
        >
          {SORTS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
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
          {/* Simple dummy slider track for now */}
          <div className="h-1 bg-cream-200 w-full rounded-full overflow-hidden">
            <div className="h-full bg-rose-brand w-1/2 rounded-full"></div>
          </div>
          <div className="flex justify-between text-xs text-ink-muted mt-3">
            <span>$0</span>
            <span>$500+</span>
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
