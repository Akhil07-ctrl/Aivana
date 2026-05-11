import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiUser, FiSearch, FiMenu, FiX, FiHeart, FiPackage, FiMapPin, FiLogOut, FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import axiosInstance from '../../api/axiosInstance';
import { usePWAInstall } from '../../hooks/usePWAInstall';

const searchPlaceholders = [
  "Search for 'Silk Dresses'...",
  "Try 'Linen Summer Sets'...",
  "AI Stylist: Find my fit...",
  "Search 'Minimalist Jewelry'...",
  "Look for 'Premium Denim'..."
];

const DynamicPlaceholder = ({ placeholderIndex }) => (
  <AnimatePresence mode="wait">
    <motion.p
      key={placeholderIndex}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.5, ease: "circOut" }}
      className="text-sm text-ink-muted italic whitespace-nowrap"
    >
      {searchPlaceholders[placeholderIndex]}
    </motion.p>
  </AnimatePresence>
);

const SuggestionsDropdown = ({
  source,
  isMobile = false,
  activeSearchSource,
  searchQuery,
  suggestions,
  isSearching,
  navigate,
  setSearchQuery,
  setSuggestions,
  setIsMobileSearchOpen,
  setActiveSearchSource
}) => {
  const isVisible = activeSearchSource === source && searchQuery.length >= 2;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          className={`absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-cream-200 overflow-hidden z-[100] ${isMobile ? 'mx-0 shadow-none border-x-0 border-t-0 rounded-none' : ''}`}
        >
          <div className="p-2 max-h-[70vh] lg:max-h-[400px] overflow-y-auto bg-white">
            <div className="px-3 py-2 text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] flex items-center justify-between">
              <span>{suggestions.length > 0 ? 'Matching Results' : 'Search Results'}</span>
              {isSearching && <div className="w-3 h-3 border-2 border-rose-brand border-t-transparent rounded-full animate-spin" />}
            </div>

            {suggestions.length > 0 ? (
              <>
                {suggestions.map((p) => (
                  <Link
                    key={p._id}
                    to={`/products/${p.slug}`}
                    onClick={() => {
                      setSearchQuery('');
                      setSuggestions([]);
                      setIsMobileSearchOpen(false);
                      setActiveSearchSource(null);
                    }}
                    className="flex items-center gap-4 p-3 hover:bg-cream-50 rounded-xl transition-colors group"
                  >
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-cream-100 flex-shrink-0 border border-cream-200">
                      <img
                        src={p.images?.[0]?.url || 'https://via.placeholder.com/100'}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-ink truncate group-hover:text-rose-brand transition-colors">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-ink-muted uppercase tracking-wider">{p.category}</p>
                    </div>
                    <div className="text-sm font-bold text-ink">
                      ₹{p.price?.toLocaleString()}
                    </div>
                  </Link>
                ))}
                <Link
                  to={`/shop?search=${searchQuery}`}
                  onClick={() => {
                    setSuggestions([]);
                    setIsMobileSearchOpen(false);
                    setActiveSearchSource(null);
                  }}
                  className="block text-center py-4 text-xs font-bold text-rose-brand hover:bg-rose-50 transition-colors border-t border-cream-100"
                >
                  See all results for "{searchQuery}"
                </Link>
              </>
            ) : isSearching ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-rose-brand border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold text-ink-muted uppercase tracking-widest">Finding matches...</p>
              </div>
            ) : (
              <div className="py-12 px-6 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-4 text-ink-muted"
                >
                  <FiSearch size={24} />
                </motion.div>
                <p className="text-sm font-bold text-ink mb-1">No matches found</p>
                <p className="text-xs text-ink-muted mb-6">We couldn't find anything for "{searchQuery}"</p>
                <button
                  onClick={() => {
                    navigate('/shop');
                    setActiveSearchSource(null);
                    setIsMobileSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="inline-flex items-center gap-2 text-xs font-bold text-rose-brand hover:text-rose-700 transition-colors group"
                >
                  Browse all collections
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { cart, setCartOpen } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeSearchSource, setActiveSearchSource] = useState(null); // 'desktop' or 'mobile'
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const { isInstallable, handleInstallClick } = usePWAInstall();


  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Debounced search for suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await axiosInstance.get('/products', {
          params: { search: searchQuery, limit: 6 }
        });
        setSuggestions(res.data.data.products || []);
      } catch (err) {
        console.error('Suggestion fetch error:', err);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSuggestions([]);
      setIsMobileSearchOpen(false);
    }
  };

  const handleComingSoon = (e) => {
    e.preventDefault();
    toast.success('Coming soon!', {
      icon: '✨',
      style: {
        borderRadius: '10px',
        background: '#1A1A2E',
        color: '#fff',
      },
    });
  };

  const cartItemsCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setIsMobileSearchOpen(false);
  }, [location.pathname]);

  // Click outside to close user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
  ];

  const userDropdownLinks = [
    { name: 'My Profile', path: '/profile', hash: '#personal', icon: <FiUser size={16} /> },
    { name: 'Orders', path: '/profile', hash: '#orders', icon: <FiPackage size={16} /> },
    { name: 'Wishlist', path: '/profile', hash: '#wishlist', icon: <FiHeart size={16} /> },
    { name: 'Addresses', path: '/profile', hash: '#addresses', icon: <FiMapPin size={16} /> },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
          }`}
      >
        <div className="container-main flex items-center justify-between gap-2 sm:gap-4">
          <AnimatePresence>
            {isMobileSearchOpen ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white z-[70] flex items-center"
              >
                <div className="container-main flex items-center gap-4 w-full">
                  <form onSubmit={handleSearch} className="flex-1 relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        autoFocus
                        type="text"
                        value={searchQuery}
                        onFocus={() => setActiveSearchSource('mobile')}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-cream-100 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-rose-brand/20 transition-all"
                      />
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
                        <FiSearch size={16} />
                      </div>
                      {!searchQuery && (
                        <div className="absolute left-10 top-1/2 -translate-y-1/2 pointer-events-none overflow-hidden h-5 w-full">
                          <DynamicPlaceholder placeholderIndex={placeholderIndex} />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileSearchOpen(false);
                        setSuggestions([]);
                        setActiveSearchSource(null);
                      }}
                      className="p-2 text-ink-muted hover:text-rose-brand font-bold text-sm whitespace-nowrap"
                    >
                      Cancel
                    </button>
                  </form>
                </div>
                {/* Mobile Suggestions Area - Positioned outside container to avoid cropping */}
                {isMobileSearchOpen && (
                  <div className="absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-cream-100">
                    <SuggestionsDropdown
                      source="mobile"
                      isMobile={true}
                      activeSearchSource={activeSearchSource}
                      searchQuery={searchQuery}
                      suggestions={suggestions}
                      isSearching={isSearching}
                      navigate={navigate}
                      setSearchQuery={setSearchQuery}
                      setSuggestions={setSuggestions}
                      setIsMobileSearchOpen={setIsMobileSearchOpen}
                      setActiveSearchSource={setActiveSearchSource}
                    />
                  </div>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2">
            <button
              className="lg:hidden text-ink hover:text-rose-brand transition p-2"
              onClick={() => setMobileMenuOpen(true)}
            >
              <FiMenu size={24} />
            </button>

            {/* Logo */}
            <Link to="/" className="font-display font-bold text-2xl tracking-wide text-ink relative z-50 hover:text-rose-brand transition-colors">
              Aivana
            </Link>
          </div>

          {/* Desktop Links */}
          <nav className="hidden xl:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-semibold text-ink-light hover:text-rose-brand transition-colors relative group"
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div layoutId="underline" className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-rose-brand rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop & Tablet */}
          <div className="hidden md:flex flex-1 max-w-md relative group">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setActiveSearchSource('desktop')}
                onBlur={() => setTimeout(() => setActiveSearchSource(null), 200)} // Delay to allow clicks
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-cream-100/50 border border-transparent focus:bg-white focus:border-rose-brand/30 focus:ring-4 focus:ring-rose-brand/5 rounded-full py-2 pl-10 pr-4 text-sm transition-all duration-300 placeholder-transparent group-hover:bg-cream-100"
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted group-focus-within:text-rose-brand transition-colors">
                <FiSearch size={16} />
              </div>

              {/* Dynamic Placeholder Layer */}
              {!searchQuery && (
                <div className="absolute left-10 top-1/2 -translate-y-1/2 pointer-events-none overflow-hidden h-5 w-full">
                  <DynamicPlaceholder placeholderIndex={placeholderIndex} />
                </div>
              )}
              {/* Desktop Suggestions */}
              <SuggestionsDropdown
                source="desktop"
                activeSearchSource={activeSearchSource}
                searchQuery={searchQuery}
                suggestions={suggestions}
                isSearching={isSearching}
                navigate={navigate}
                setSearchQuery={setSearchQuery}
                setSuggestions={setSuggestions}
                setIsMobileSearchOpen={setIsMobileSearchOpen}
                setActiveSearchSource={setActiveSearchSource}
              />
            </form>
          </div>

          {/* Icons Context */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 relative z-50">
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="md:hidden p-2 text-ink-light hover:text-rose-brand transition hover:bg-cream-100 rounded-full"
            >
              <FiSearch size={20} />
            </button>

            {user && (
              <Link to="/wishlist" className="p-2 text-ink-light hover:text-rose-brand transition relative hover:bg-cream-100 rounded-full hidden sm:block">
                <FiHeart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-rose-brand text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={() => setCartOpen(true)}
              className="p-2 text-ink-light hover:text-rose-brand transition relative cursor-pointer hover:bg-cream-100 rounded-full"
            >
              <FiShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-brand text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Dropdown / Sign In */}
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <div className="flex items-center gap-1 lg:gap-2">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border transition-all duration-200 ${userMenuOpen ? 'bg-ink border-ink text-white' : 'bg-white border-cream-300 text-ink hover:border-rose-brand'}`}
                  >
                    <div className="w-7 h-7 rounded-full bg-cream-200 overflow-hidden flex items-center justify-center ring-1 ring-black/5">
                      {user.avatar?.url ? (
                        <img src={user.avatar.url} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <FiUser size={14} className={userMenuOpen ? "text-white/80" : "text-ink-muted"} />
                      )}
                    </div>
                    <span className="hidden lg:block text-sm font-semibold pr-1">My Account</span>
                    <FiChevronDown size={14} className={`hidden lg:block transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-cream-200 overflow-hidden py-2"
                        style={{ top: '100%' }}
                      >
                        <div className="px-4 py-3 border-b border-cream-100 mb-2">
                          <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-0.5">Signed in as</p>
                          <p className="text-sm font-bold text-ink truncate">{user.name}</p>
                        </div>

                        {userDropdownLinks.map((link) => (
                          <Link
                            key={link.name}
                            to={link.path + (link.hash || '')}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-ink-light hover:bg-cream-50 hover:text-rose-brand transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <span className="text-ink-muted">{link.icon}</span>
                            {link.name}
                          </Link>
                        ))}

                        <div className="mt-2 pt-2 border-t border-cream-100 px-2">
                          <button
                            onClick={() => {
                              logout();
                              setUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <FiLogOut size={16} />
                            Log out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" className="flex items-center justify-center p-2 text-ink-light hover:text-rose-brand transition hover:bg-cream-100 rounded-full lg:bg-ink lg:text-white lg:px-6 lg:py-2.5 lg:rounded-full lg:shadow-lg lg:shadow-ink/10 lg:hover:bg-rose-brand lg:hover:text-white lg:font-bold lg:text-sm">
                  <FiUser size={20} className="lg:hidden" />
                  <span className="hidden lg:block">Sign in</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 flex justify-between items-center border-b border-cream-200 bg-cream-50/50">
                <Link to="/" className="font-display font-bold text-2xl text-ink" onClick={() => setMobileMenuOpen(false)}>Aivana</Link>
                <button onClick={() => setMobileMenuOpen(false)} className="text-ink hover:text-rose-brand p-2 hover:bg-white rounded-full transition-colors">
                  <FiX size={24} />
                </button>
              </div>

              <div className="flex flex-col p-6 gap-2 overflow-y-auto">
                <p className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] mb-2 px-2">Navigation</p>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-lg font-bold px-3 py-3 rounded-xl transition-all ${location.pathname === link.path ? 'bg-rose-50 text-rose-brand' : 'text-ink-light hover:bg-cream-100'}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="mt-auto p-6 border-t border-cream-200 bg-cream-50/30">
                <div className="flex flex-col gap-4">
                  <p className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] mb-1 px-2">Need Help?</p>
                  <button onClick={handleComingSoon} className="text-left text-sm font-semibold text-ink-light px-2 hover:text-rose-brand transition-colors">Contact Support</button>
                  <button onClick={handleComingSoon} className="text-left text-sm font-semibold text-ink-light px-2 hover:text-rose-brand transition-colors">FAQs</button>
                </div>

                {isInstallable && (
                  <div className="mt-8 px-2">
                    <button
                      onClick={handleInstallClick}
                      className="w-full bg-ink text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-ink/20 flex items-center justify-center gap-3 hover:bg-rose-brand transition-all"
                    >
                      <FiPackage size={18} />
                      Install App Experience
                    </button>
                    <p className="text-[10px] text-ink-muted/60 text-center mt-3 uppercase tracking-widest font-bold">Recommended for better performance</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
