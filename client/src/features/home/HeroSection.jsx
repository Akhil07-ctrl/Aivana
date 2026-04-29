import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-cream-50 pt-20">
      {/* Background Graphic elements to make it premium */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-rose-brand/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-cream-300/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="container-main relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left: Text Content */}
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-rose-50 border border-rose-100 text-rose-brand text-xs font-semibold tracking-wide mb-6 uppercase">
              New Collection 2026
            </span>
          </motion.div>

          <motion.h1
            className="font-display text-5xl md:text-7xl font-bold text-ink leading-[1.1] tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            Discover your
            <br />
            <span className="italic font-normal text-rose-brand">signature style.</span>
          </motion.h1>

          <motion.p
            className="text-lg text-ink-muted mb-10 max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          >
            Aivana curates the finest fashion pieces using next-generation style intelligence. Premium fabrics, flawless fits.
          </motion.p>

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
          >
            <Link to="/shop" className="btn-primary text-lg px-8 py-4">
              Shop the Collection
            </Link>
            <Link to="/categories" className="btn-ghost font-semibold text-lg hover:bg-cream-200">
              Explore Categories
            </Link>
          </motion.div>
        </div>

        {/* Right: Images Composition */}
        <div className="relative h-[600px] hidden lg:block">
          <motion.div
            className="absolute right-0 top-[10%] w-[80%] h-[80%] rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Using a beautiful Unsplash placeholder for fashion */}
            <img
              src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Fashion model"
              className="w-full h-full object-cover rounded-2xl"
            />
          </motion.div>

          <motion.div
            className="absolute left-[5%] bottom-[15%] w-[45%] h-[40%] rounded-2xl overflow-hidden shadow-card-hover border-4 border-white"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Detail fashion"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Floating UI Element */}
          <motion.div
            className="absolute right-[50%] top-[25%] bg-white/90 backdrop-blur-md px-6 py-4 rounded-xl shadow-lg border border-cream-200"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.2, type: 'spring' }}
            style={{ y: '-50%', x: '50%' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-brand text-white flex items-center justify-center font-bold font-display">
                ✨
              </div>
              <div>
                <p className="text-xs text-ink-muted uppercase tracking-wider font-semibold">AI Match</p>
                <p className="font-semibold text-ink text-sm">Perfect fit guaranteed</p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
