import { motion } from 'framer-motion';
import { FiInstagram } from 'react-icons/fi';

const styleImages = [
  {
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=500&h=600',
    tag: '#AivanaStyle',
  },
  {
    url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=500&h=600',
    tag: '#OOTD',
  },
  {
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=500&h=600',
    tag: '#StreetStyle',
  },
  {
    url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=500&h=600',
    tag: '#AivanaWomen',
  },
  {
    url: 'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?auto=format&fit=crop&q=80&w=500&h=600',
    tag: '#MinimalFashion',
  },
  {
    url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=500&h=600',
    tag: '#AivanaMen',
  },
];

export default function StyleGallery() {
  return (
    <section className="py-20 md:py-24 bg-white overflow-hidden">
      <div className="container-main">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs font-bold text-rose-brand uppercase tracking-[0.2em]">Style Inspo</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mt-3 mb-3">
            #AivanaStyle
          </h2>
          <p className="text-ink-muted max-w-md mx-auto">
            Get inspired by our community. Tag us on Instagram to get featured.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {styleImages.map((img, i) => (
            <motion.div
              key={i}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer bg-cream-100"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <img
                src={img.url}
                alt={img.tag}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/50 transition-all duration-500 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-center">
                  <FiInstagram size={28} className="text-white mx-auto mb-2" />
                  <span className="text-white text-xs font-bold tracking-wider">{img.tag}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-ink hover:text-rose-brand transition-colors group"
          >
            <FiInstagram size={18} className="group-hover:scale-110 transition-transform" />
            Follow us @aivana
          </a>
        </motion.div>
      </div>
    </section>
  );
}
