import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import EleganceVideo from '../../assets/Elegance_Video.mp4';

export default function EleganceSection() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Video container: starts as a rounded card, expands to full-bleed
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.7, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.4], [48, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  // Text: fades in as you scroll deeper
  const textOpacity = useTransform(scrollYProgress, [0.2, 0.45], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.2, 0.45], [60, 0]);

  return (
    <section
      ref={containerRef}
      className="relative bg-ink overflow-hidden"
      style={{ minHeight: '140vh' }}
    >
      {/* Sticky Inner Container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Video Frame */}
        <motion.div
          style={{ scale, borderRadius, opacity }}
          className="absolute inset-0 overflow-hidden"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover lg:object-[50%_15%]"
          >
            <source src={EleganceVideo} type="video/mp4" />
          </video>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-ink/60" />
        </motion.div>

        {/* Text Content */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="relative z-10 text-center px-6 max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-px bg-rose-brand/60" />
            <span className="text-rose-brand text-[10px] font-bold uppercase tracking-[0.25em]">
              Philosophy
            </span>
            <div className="w-12 h-px bg-rose-brand/60" />
          </div>

          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.1]">
            Elegance is an{' '}
            <span className="italic text-rose-brand">attitude.</span>
          </h2>

          <p className="text-cream-300/70 text-lg lg:text-xl leading-relaxed max-w-xl mx-auto mb-12">
            Sign up today and let our upcoming AI stylist curate your perfect
            wardrobe based on your unique preferences.
          </p>

          <a
            href="/register"
            className="btn-primary text-sm px-10 py-4 inline-block"
          >
            Create Free Account
          </a>
        </motion.div>
      </div>
    </section>
  );
}
