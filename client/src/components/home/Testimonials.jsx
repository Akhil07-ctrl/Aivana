import { motion } from 'framer-motion';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const testimonials = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    text: 'Absolutely love the quality! The fabric feels premium and the fit is spot on. Aivana has become my go-to for everyday fashion.',
    avatar: 'PS',
  },
  {
    name: 'Rahul Verma',
    location: 'Delhi',
    rating: 5,
    text: 'Fast delivery and the packaging was super elegant. The t-shirts are so comfortable — ordered 3 more the same week!',
    avatar: 'RV',
  },
  {
    name: 'Ananya Reddy',
    location: 'Hyderabad',
    rating: 5,
    text: 'The AI stylist feature is a game changer. It recommended pieces I never would have picked myself, and I loved every one of them.',
    avatar: 'AR',
  },
  {
    name: 'Karthik Nair',
    location: 'Bangalore',
    rating: 4,
    text: 'Great collection for men. The denim jacket I bought gets compliments everywhere. Will definitely shop again.',
    avatar: 'KN',
  },
  {
    name: 'Meera Kapoor',
    location: 'Pune',
    rating: 5,
    text: 'Sustainable and stylish. I love how Aivana balances modern trends with timeless quality. Highly recommend!',
    avatar: 'MK',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-cream-50 border-y border-cream-200 overflow-hidden relative">
      <div className="container-main">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs font-bold text-rose-brand uppercase tracking-[0.2em]">Customer Love</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mt-3 mb-3">
            What Our Customers Say
          </h2>
          <p className="text-ink-muted max-w-md mx-auto">
            Real stories from real people who trust Aivana for their everyday style.
          </p>
        </motion.div>

        <div className="relative group px-4">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={20}
            slidesPerView={1.2}
            centeredSlides={true}
            loop={true}
            watchSlidesProgress={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              el: '.testimonials-pagination',
            }}
            navigation={{
              nextEl: '.testimonials-next',
              prevEl: '.testimonials-prev',
            }}
            breakpoints={{
              640: {
                slidesPerView: 2.2,
                centeredSlides: true,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                centeredSlides: true,
                spaceBetween: 40,
              },
            }}
            className="pb-16 !overflow-visible"
          >
            {[...testimonials, ...testimonials].map((t, i) => (
              <SwiperSlide key={i} className="h-auto">
                {({ isActive }) => (
                  <motion.div
                    animate={{
                      scale: isActive ? 1 : 0.9,
                      opacity: isActive ? 1 : 0.6,
                    }}
                    transition={{ duration: 0.4 }}
                    className="group h-full bg-white rounded-3xl p-8 border border-cream-200 hover:border-rose-brand/20 hover:shadow-2xl hover:shadow-cream-200 transition-all duration-500 flex flex-col shadow-sm"
                  >
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-6">
                      {[1, 2, 3, 4, 5].map(s => (
                        <FiStar
                          key={s}
                          size={16}
                          className={s <= t.rating ? 'text-yellow-500 fill-yellow-500' : 'text-cream-300'}
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-ink-light text-base leading-relaxed flex-1 italic mb-8">
                      "{t.text}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4 pt-6 border-t border-cream-100">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-brand to-pink-400 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-rose-brand/20">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="text-base font-bold text-ink">{t.name}</p>
                        <p className="text-xs text-ink-muted tracking-wide uppercase">{t.location}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation */}
          <button className="testimonials-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 z-10 w-12 h-12 rounded-full bg-white border border-cream-200 flex items-center justify-center shadow-lg text-ink hover:bg-rose-brand hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex">
            <FiChevronLeft size={24} />
          </button>
          <button className="testimonials-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 z-10 w-12 h-12 rounded-full bg-white border border-cream-200 flex items-center justify-center shadow-lg text-ink hover:bg-rose-brand hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex">
            <FiChevronRight size={24} />
          </button>

          {/* Custom Pagination */}
          <div className="testimonials-pagination flex justify-center gap-2 mt-8" />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .testimonials-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #D1D1D1;
          opacity: 1;
          transition: all 0.3s ease;
          border-radius: 4px;
        }
        .testimonials-pagination .swiper-pagination-bullet-active {
          width: 24px;
          background: #E53E3E;
        }
      `}} />
    </section>
  );
}
