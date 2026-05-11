import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-rose-brand/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cream-200/40 rounded-full blur-3xl animate-pulse" />

      <div className="relative flex flex-col items-center">
        {/* Animated Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative flex flex-col items-center"
        >
          <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tighter text-ink mb-2">
            AIVANA
          </h1>
          <p className="text-[10px] md:text-xs font-bold text-rose-brand uppercase tracking-[0.5em] ml-2">
            Fashion Redefined
          </p>
        </motion.div>

        {/* Loading Indicator */}
        <div className="mt-12 w-48 h-[2px] bg-cream-100 rounded-full overflow-hidden relative">
          <motion.div
            className="absolute top-0 left-0 h-full bg-rose-brand"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Sub-loading text */}
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative mt-4 text-[10px] text-ink-muted/60 font-medium tracking-widest uppercase"
        >
          Curating Your Experience
        </motion.p>
      </div>

      {/* Modern Scanning Effect Line */}
      <motion.div
        className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-brand/20 to-transparent"
        animate={{ top: ["20%", "80%", "20%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}
