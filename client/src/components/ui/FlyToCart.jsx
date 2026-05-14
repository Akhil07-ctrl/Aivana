import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FlyToCart() {
  const [animations, setAnimations] = useState([]);

  useEffect(() => {
    const handleFlyToCart = (e) => {
      const { imageUrl, startX, startY } = e.detail;
      const cartBtn = document.getElementById('nav-cart-btn');

      if (!cartBtn) return;

      const rect = cartBtn.getBoundingClientRect();
      const endX = rect.left + rect.width / 2;
      const endY = rect.top + rect.height / 2;

      const id = Math.random().toString(36).substring(2, 9);
      setAnimations((prev) => [...prev, { id, imageUrl, startX, startY, endX, endY }]);

      // Cleanup after animation completes
      setTimeout(() => {
        setAnimations((prev) => prev.filter((anim) => anim.id !== id));
      }, 1000);
    };

    window.addEventListener('cart:fly', handleFlyToCart);
    return () => window.removeEventListener('cart:fly', handleFlyToCart);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1000]">
      <AnimatePresence>
        {animations.map((anim) => (
          <motion.div
            key={anim.id}
            initial={{
              x: anim.startX,
              y: anim.startY,
              scale: 1,
              opacity: 1,
              rotate: 0
            }}
            animate={{
              x: anim.endX,
              y: anim.endY,
              scale: 0.1,
              opacity: 0,
              rotate: 360
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="fixed top-0 left-0 w-24 h-24 -ml-12 -mt-12 rounded-2xl overflow-hidden shadow-2xl border-2 border-white"
          >
            <img src={anim.imageUrl} alt="" className="w-full h-full object-cover" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export const triggerFlyToCart = (imageUrl, startX, startY) => {
  window.dispatchEvent(new CustomEvent('cart:fly', {
    detail: { imageUrl, startX, startY }
  }));
};
