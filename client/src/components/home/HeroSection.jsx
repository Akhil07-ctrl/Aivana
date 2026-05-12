import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import discoverVideo from '../../assets/Discover_Video.mp4';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] lg:h-screen w-full flex items-center justify-center overflow-hidden bg-transparent pt-24 pb-12 lg:py-0">
      {/* Fixed Parallax Background Video */}
      <div className="fixed inset-0 w-full h-screen z-[-1]">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover lg:object-[50%_30%] opacity-50 brightness-75"
        >
          <source src={discoverVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/50 to-ink" />
      </div>

      {/* Background Graphic elements to make it premium */}
      <div className="absolute top-[-10%] right-0 w-64 md:w-96 h-64 md:h-96 bg-rose-brand/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-0 w-64 md:w-96 h-64 md:h-96 bg-cream-300/40 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />

      <div className="container-main relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

        {/* Left: Text Content */}
        <div className="max-w-2xl text-center lg:text-left">
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
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            Discover your
            <br />
            <span className="italic font-normal text-rose-brand">signature style.</span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg text-white/90 mb-10 max-w-md mx-auto lg:mx-0 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          >
            Aivana curates the finest fashion pieces using next-generation style intelligence. Premium fabrics, flawless fits.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
          >
            <Link to="/shop" className="w-full sm:w-auto btn-primary text-base sm:text-lg px-8 py-4 text-center">
              Shop the Collection
            </Link>
            <Link
              to="/categories"
              className="group flex items-center gap-2 font-semibold text-base sm:text-lg text-white hover:text-rose-brand transition-all duration-300 py-4 px-2"
            >
              Explore Categories
              <motion.span
                animate={{ x: 0 }}
                whileHover={{ x: 6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="inline-flex items-center"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </motion.span>
            </Link>
          </motion.div>
        </div>

        {/* Right: Images Composition (Now responsive for all devices) */}
        <div className="relative h-[400px] sm:h-[500px] md:h-[600px] mt-8 lg:mt-0">
          <motion.div
            className="absolute right-0 top-0 lg:top-[10%] w-[85%] lg:w-[80%] h-[90%] lg:h-[80%] rounded-2xl overflow-hidden shadow-2xl z-10"
            initial={{ opacity: 0, scale: 0.95, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Fashion model"
              className="w-full h-full object-cover"
              loading="eager"
            />
            {/* Glassmorphism Overlay for "AI Scan" effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-rose-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </motion.div>

          {/* Secondary Smaller Image */}
          <motion.div
            className="absolute left-0 bottom-[5%] lg:left-[5%] lg:bottom-[15%] w-[50%] lg:w-[45%] h-[45%] lg:h-[40%] rounded-2xl overflow-hidden shadow-card-hover border-4 border-white/10 z-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ rotateZ: -5 }}
          >
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Detail fashion"
              className="w-full h-full object-cover"
            />
          </motion.div>


          {/* Decorative AI scanning lines */}

          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-brand/40 to-transparent z-40"
            animate={{ top: ['10%', '90%', '10%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
        </div>

      </div>
    </section>
  );
}
