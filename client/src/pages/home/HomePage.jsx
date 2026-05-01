import PageWrapper from '../../components/layout/PageWrapper';
import HeroSection from '../../components/home/HeroSection';
import FeaturedProducts from '../../components/home/FeaturedProducts';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <PageWrapper>
      <main className="flex-1">
        <HeroSection />
        <FeaturedProducts />

        {/* Simple Call to Action Banner */}
        <section className="py-24 bg-ink text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg patternUnits="userSpaceOnUse" width="40" height="40" className="absolute inset-0 w-full h-full">
              <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className="container-main relative z-10 text-center">
            <motion.h2
              className="font-display text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Elegance is an attitude.
            </motion.h2>
            <motion.p
              className="text-cream-300 text-lg max-w-xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Sign up today and let our upcoming AI stylist curate your perfect wardrobe based on your unique preferences.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <a href="/register" className="btn-primary text-lg px-8 py-4">
                Create Free Account
              </a>
            </motion.div>
          </div>
        </section>
      </main>
    </PageWrapper>
  );
}
