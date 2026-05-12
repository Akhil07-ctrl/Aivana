import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';
import 'swiper/css';
import ProductCard from '../product/ProductCard';

export default function TrendingSlider({ products }) {
  if (!products || products.length === 0) return null;

  // Swiper loop mode requires a minimum number of slides to function correctly without gaps.
  // If we have fewer than 6 products, we duplicate them to ensure a smooth infinite loop.
  const displayProducts = products.length > 0 && products.length < 6
    ? [...products, ...products]
    : products;

  return (
    <div className="lg:hidden py-8 -mx-4 px-4 overflow-hidden">
      <Swiper
        slidesPerView={1.3}
        centeredSlides={true}
        spaceBetween={20}
        grabCursor={true}
        loop={true}
        className="trending-swiper"
        breakpoints={{
          // Tablet view
          640: {
            slidesPerView: 2.2,
            spaceBetween: 30,
          },
        }}
      >
        {displayProducts.map((product, index) => (
          <SwiperSlide key={`${product._id}-${index}`} className="pb-12">
            {({ isActive }) => (
              <motion.div
                animate={{
                  scale: isActive ? 1 : 0.9,
                  opacity: isActive ? 1 : 0.7,
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut"
                }}
                className="h-full"
              >
                <ProductCard product={product} />
              </motion.div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Visual Indicator for Swipe */}
      <div className="flex justify-center gap-1.5 mt-2">
        <div className="w-8 h-1 bg-rose-brand/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-rose-brand"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
}
