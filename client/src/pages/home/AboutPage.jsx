import { motion } from 'framer-motion';
import PageWrapper from '../../components/layout/PageWrapper';
import { FiStar, FiShield, FiHeart, FiGlobe } from 'react-icons/fi';

const features = [
  {
    icon: <FiStar className="text-rose-brand" />,
    title: 'Curated Excellence',
    description: 'Every piece in our collection is handpicked for its quality, design, and ability to tell a story.'
  },
  {
    icon: <FiShield className="text-rose-brand" />,
    title: 'Ethical Craftsmanship',
    description: 'We partner with artisans who prioritize sustainable practices and fair labor conditions.'
  },
  {
    icon: <FiHeart className="text-rose-brand" />,
    title: 'Personalized Styling',
    description: 'Our AI-driven recommendations ensure that every choice you make is perfectly suited to your unique aesthetic.'
  },
  {
    icon: <FiGlobe className="text-rose-brand" />,
    title: 'Global Influence',
    description: 'Bringing together the finest trends and traditions from across the globe to your doorstep.'
  }
];

export default function AboutPage() {
  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-ink">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1441996644326-05531dc3396b?auto=format&fit=crop&q=80&w=2000"
            alt="Fashion Backdrop"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-ink" />
        </div>

        <div className="container-main relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-rose-brand/20 text-rose-brand text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              Our Story
            </span>
            <h1 className="font-display text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Redefining the <span className="italic text-rose-brand">Art of Dressing</span> in the Digital Age.
            </h1>
            <p className="text-cream-300 text-lg lg:text-xl leading-relaxed mb-10 max-w-2xl">
              Aivana was born from a simple belief: that fashion should be as unique as the individual. We blend premium craftsmanship with intelligent technology to create a shopping experience that feels personal, effortless, and inspiring.
            </p>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
            <div className="w-px h-12 bg-gradient-to-b from-rose-brand to-transparent" />
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="py-24 lg:py-40 bg-white">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=1000"
                  alt="Craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-cream-100 rounded-[2rem] -z-10" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-ink mb-8 leading-tight">
                Where Tradition Meets <br/>
                <span className="text-rose-brand">Innovation.</span>
              </h2>
              <div className="space-y-6 text-ink-muted text-lg leading-relaxed">
                <p>
                  At Aivana, we don't just sell clothes; we curate identities. Our journey began with a vision to bridge the gap between traditional craftsmanship and modern technology.
                </p>
                <p>
                  By leveraging AI-driven styling and a deep commitment to ethical sourcing, we've created a platform where every garment is a statement of quality and every purchase is a step towards a more conscious future.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 mt-12">
                <div>
                  <h4 className="text-3xl font-bold text-ink mb-1">10k+</h4>
                  <p className="text-sm text-ink-muted uppercase tracking-wider">Happy Customers</p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-ink mb-1">500+</h4>
                  <p className="text-sm text-ink-muted uppercase tracking-wider">Premium Pieces</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 lg:py-40 bg-cream-50">
        <div className="container-main">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-ink mb-6">Our Core Values</h2>
            <p className="text-ink-muted max-w-xl mx-auto">
              The principles that guide everything we do, from sourcing materials to serving our global community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-10 rounded-[2rem] border border-cream-200 hover:shadow-2xl hover:shadow-rose-brand/5 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-ink mb-4">{feature.title}</h3>
                <p className="text-ink-muted text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 lg:py-40 bg-ink relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg patternUnits="userSpaceOnUse" width="100" height="100" className="absolute inset-0 w-full h-full text-white">
            <circle cx="50" cy="50" r="1" fill="currentColor" />
          </svg>
        </div>
        
        <div className="container-main relative z-10 text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="font-display text-4xl lg:text-6xl font-bold text-white mb-10"
          >
            Ready to Find Your <br/>
            <span className="text-rose-brand">Signature Fit?</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <a href="/shop" className="btn-primary text-lg px-10 py-4 inline-block">
              Start Exploring
            </a>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
