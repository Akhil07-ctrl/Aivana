import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PRIMARY_CATEGORIES } from '../../constants/categories';
import { FiArrowRight } from 'react-icons/fi';

export default function CategoryGrid() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-center md:text-left">
          <div className="max-w-2xl mx-auto md:mx-0">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-rose-brand text-[10px] font-bold uppercase tracking-[0.2em] block mb-4"
            >
              Discover
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl lg:text-5xl font-bold text-ink leading-tight"
            >
              Shop by Category
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-center md:justify-end"
          >
            <Link
              to="/categories"
              className="group flex items-center gap-3 font-bold text-ink hover:text-rose-brand transition-colors border-b-2 border-cream-200 pb-1 hover:border-rose-brand"
            >
              View All Collections
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRIMARY_CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />

              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="font-display text-2xl font-bold text-white mb-2">{category.name}</h3>
                <p className="text-cream-200/80 text-xs mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  {category.description}
                </p>
                <Link
                  to={`/shop?category=${category.name}`}
                  className="inline-flex items-center justify-center w-10 h-10 bg-white text-ink rounded-full transition-all duration-300 group-hover:w-full group-hover:bg-rose-brand group-hover:text-white"
                >
                  <FiArrowRight className="group-hover:mr-2" />
                  <span className="hidden group-hover:inline text-xs font-bold uppercase tracking-wider">Explore</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
