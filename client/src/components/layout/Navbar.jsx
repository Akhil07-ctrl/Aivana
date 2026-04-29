import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiUser, FiSearch, FiMenu, FiX, FiHeart } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { cart, setCartOpen } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const location = useLocation();

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
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
    ...(user ? [{ name: 'My Orders', path: '/orders' }] : []),
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
          }`}
      >
        <div className="container-main flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-ink hover:text-rose-brand transition"
            onClick={() => setMobileMenuOpen(true)}
          >
            <FiMenu size={24} />
          </button>

          {/* Logo */}
          <Link to="/" className="font-display font-bold text-2xl tracking-wide text-ink relative z-50">
            Aivana
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-medium text-ink-light hover:text-rose-brand transition-colors relative group"
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div layoutId="underline" className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-rose-brand" />
                )}
              </Link>
            ))}
          </nav>

          {/* Icons Context */}
          <div className="flex items-center gap-4 lg:gap-6 relative z-50">
            <button className="text-ink-light hover:text-rose-brand transition">
              <FiSearch size={20} />
            </button>
            {user && (
              <Link to="/wishlist" className="text-ink-light hover:text-rose-brand transition relative">
                <FiHeart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-brand text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}
            <button 
              onClick={() => setCartOpen(true)}
              className="text-ink-light hover:text-rose-brand transition relative cursor-pointer"
            >
              <FiShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-brand text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
            
            {user ? (
              <div className="hidden lg:flex items-center gap-3">
                <Link to="/profile" className="text-sm font-medium text-ink flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-cream-200 overflow-hidden flex items-center justify-center line-clamp-1">
                    {user.avatar?.url ? (
                      <img src={user.avatar.url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <FiUser size={14} className="text-ink-muted" />
                    )}
                  </div>
                </Link>
                <button onClick={logout} className="text-xs text-ink-muted hover:text-red-500 font-medium">Log out</button>
              </div>
            ) : (
              <Link to="/login" className="hidden lg:flex text-sm font-medium text-white bg-ink px-4 py-2 rounded shadow-sm hover:shadow-lg transition hover:bg-rose-brand">
                Sign in
              </Link>
            )}
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
              className="absolute top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 flex justify-between items-center border-b border-cream-200">
                <Link to="/" className="font-display font-bold text-2xl text-ink" onClick={() => setMobileMenuOpen(false)}>Aivana</Link>
                <button onClick={() => setMobileMenuOpen(false)} className="text-ink hover:text-rose-brand">
                  <FiX size={24} />
                </button>
              </div>
              <div className="flex flex-col p-6 gap-6 overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-lg font-medium ${location.pathname === link.path ? 'text-rose-brand' : 'text-ink-light'}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="mt-auto p-6 border-t border-cream-200">
                {user ? (
                  <div className="flex flex-col gap-4">
                    <Link to="/profile" className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center overflow-hidden">
                         {user.avatar?.url ? <img src={user.avatar.url} className="w-full h-full object-cover" /> : <FiUser />}
                      </div>
                      <div>
                        <p className="font-semibold text-ink text-sm">{user.name}</p>
                        <p className="text-xs text-ink-muted">{user.email}</p>
                      </div>
                    </Link>
                    <button onClick={logout} className="btn-outline w-full justify-center">Log out</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link to="/login" className="btn-primary w-full text-center">Sign in</Link>
                    <Link to="/register" className="btn-outline w-full text-center">Create account</Link>
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
