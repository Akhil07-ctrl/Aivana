import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';

export default function CartDrawer() {
  const { cart, isCartOpen, setCartOpen, updateQuantity, removeItem } = useCartStore();
  const { user } = useAuthStore();

  // Prevent background scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCartOpen]);

  const items = cart?.items || [];
  const totalPrice = cart?.totalPrice || 0;
  const itemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-cream-200">
              <h2 className="font-display font-bold text-2xl text-ink items-center gap-2 flex">
                <FiShoppingBag /> Your Cart <span className="text-sm font-normal text-ink-muted ml-2">({itemCount})</span>
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 text-ink-muted hover:text-rose-brand transition-colors rounded-full hover:bg-cream-100"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Cart Body */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-cream-100 rounded-full flex items-center justify-center mb-6">
                  <FiShoppingBag className="text-cream-300 w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-ink mb-2">Your cart is empty</h3>
                <p className="text-ink-muted mb-8 max-w-xs">
                  {user ? "Looks like you haven't added anything yet." : "Sign in to view your synced cart or start shopping now."}
                </p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="btn-primary"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                {items.map((item, idx) => {
                  const product = item.product;
                  const primaryImg = product?.images?.[0]?.url || 'https://via.placeholder.com/150';

                  return (
                    <div key={idx} className="flex gap-4 p-4 border border-cream-200 rounded-xl hover:border-cream-300 transition-colors">
                      <div className="w-20 h-24 bg-cream-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={primaryImg} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <Link to={`/products/${product.slug}`} onClick={() => setCartOpen(false)} className="font-semibold text-ink line-clamp-1 hover:text-rose-brand">
                              {product.name}
                            </Link>
                            <button
                              onClick={() => removeItem({ productId: product._id, size: item.size, color: item.color })}
                              className="text-ink-muted hover:text-red-500"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>

                          <div className="flex gap-3 mt-1 text-xs text-ink-muted">
                            {item.color && <span>Color: {item.color}</span>}
                            {item.size && <span>Size: {item.size}</span>}
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-3">
                          <p className="font-bold text-ink">${item.price.toFixed(2)}</p>
                          <div className="flex items-center border border-cream-300 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity({ productId: product._id, size: item.size, color: item.color, quantity: item.quantity - 1 })}
                              className="w-8 h-8 flex items-center justify-center hover:bg-cream-100 text-ink-muted hover:text-ink transition-colors"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity({ productId: product._id, size: item.size, color: item.color, quantity: item.quantity + 1 })}
                              className="w-8 h-8 flex items-center justify-center hover:bg-cream-100 text-ink-muted hover:text-ink transition-colors"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="p-6 border-t border-cream-200 bg-cream-50">
                <div className="flex justify-between items-center mb-4 text-ink">
                  <span className="font-medium text-ink-muted">Subtotal</span>
                  <span className="font-bold text-xl">${totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs text-ink-muted mb-6">Shipping and taxes calculated at checkout.</p>

                {user ? (
                  <Link
                    to="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="btn-primary w-full text-center py-4 text-lg animate-pulse-once"
                  >
                    Proceed to Checkout
                  </Link>
                ) : (
                  <Link
                    to="/login?redirect=cart"
                    onClick={() => setCartOpen(false)}
                    className="btn-outline w-full text-center py-4 text-lg"
                  >
                    Sign in to Checkout
                  </Link>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
