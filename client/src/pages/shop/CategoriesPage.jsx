import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import { PRIMARY_CATEGORIES } from '../../constants/categories';
import { FiArrowRight } from 'react-icons/fi';

export default function CategoriesPage() {
  return (
    <PageWrapper>
      {/* Header Section */}
      <section className="bg-cream-50 border-b border-cream-200 pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="container-main text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-rose-50 text-rose-brand text-[10px] font-bold uppercase tracking-[0.2em] mb-6"
          >
            Our Collections
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl lg:text-6xl font-bold text-ink mb-6"
          >
            Shop by Category
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-ink-muted max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Explore our meticulously curated collections, designed to inspire and elevate your personal expression through premium craftsmanship and timeless style.
          </motion.p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 lg:py-32">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {PRIMARY_CATEGORIES.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative h-[400px] lg:h-[500px] rounded-[2rem] overflow-hidden bg-cream-100 shadow-xl shadow-ink/5"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                  <div className="relative z-10">
                    <h3 className="font-display text-3xl lg:text-4xl font-bold text-white mb-3 transform transition-transform duration-500 group-hover:-translate-y-2">
                      {category.name}
                    </h3>
                    <p className="text-cream-200/80 text-sm lg:text-base max-w-sm mb-8 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                      {category.description}
                    </p>
                    <Link
                      to={`/shop?category=${category.name}`}
                      className="inline-flex items-center gap-3 px-8 py-3.5 bg-white text-ink rounded-full text-sm font-bold tracking-wide transition-all duration-300 hover:bg-rose-brand hover:text-white group/btn"
                    >
                      Explore Collection
                      <FiArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>

                {/* Decorative border on hover */}
                <div className="absolute inset-4 border border-white/20 rounded-[1.5rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Accent */}
      <section className="py-20 bg-cream-50 overflow-hidden">
        <div className="container-main flex flex-col items-center">
          <div className="flex gap-4 opacity-30 whitespace-nowrap animate-scroll">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <span key={i} className="font-display text-7xl lg:text-9xl font-bold text-ink-muted/20 uppercase">
                Aivana Collections • Timeless Style •
              </span>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
