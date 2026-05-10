import { motion } from 'framer-motion';
import { FiTruck, FiRefreshCw, FiShield, FiHeadphones } from 'react-icons/fi';

const perks = [
  {
    icon: FiTruck,
    title: 'Free Shipping',
    desc: 'Complimentary delivery on all orders above ₹499 across India.',
  },
  {
    icon: FiRefreshCw,
    title: 'Easy Returns',
    desc: '7-day hassle-free returns and exchanges. No questions asked.',
  },
  {
    icon: FiShield,
    title: 'Secure Payments',
    desc: 'Your transactions are protected with industry-grade encryption.',
  },
  {
    icon: FiHeadphones,
    title: '24/7 Support',
    desc: 'Our team is always here to help you with any queries.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function BrandPerks() {
  return (
    <section className="py-20 md:py-24 bg-cream-50 border-y border-cream-200">
      <div className="container-main">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs font-bold text-rose-brand uppercase tracking-[0.2em]">Why Aivana</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mt-3">
            Shopping Made Effortless
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {perks.map((perk, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="group bg-white rounded-2xl p-8 text-center border border-cream-200 hover:border-rose-brand/30 hover:shadow-xl hover:shadow-cream-200 transition-all duration-500"
            >
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-cream-50 group-hover:bg-rose-brand/10 flex items-center justify-center transition-colors duration-500 border border-cream-200 group-hover:border-rose-brand/20">
                <perk.icon size={24} className="text-ink-muted group-hover:text-rose-brand transition-colors duration-500" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink mb-2">{perk.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{perk.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
