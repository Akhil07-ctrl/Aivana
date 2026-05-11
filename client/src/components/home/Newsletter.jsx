import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      return toast.error('Please enter a valid email address');
    }
    toast('Newsletter coming soon! We will keep you updated.', {
      icon: '✨',
      style: {
        borderRadius: '12px',
        background: '#1A1A2E',
        color: '#F1F1F1',
        fontSize: '14px',
      },
    });
    setEmail('');
  };

  return (
    <section className="py-20 md:py-24 bg-white border-t border-cream-200">
      <div className="container-main">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-bold text-rose-brand uppercase tracking-[0.2em]">Stay In The Loop</span>
            <h2 className="font-display text-4xl md:text-5xl text-ink font-medium tracking-tight mt-3 mb-6">
              Get 10% Off Your First Order
            </h2>
            <p className="text-ink-muted max-w-md mx-auto mb-10 leading-relaxed">
              Subscribe to our newsletter for exclusive drops, style tips, and early access to sales. No spam, ever.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto w-full px-4 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-5 py-4 bg-cream-50 border border-cream-300 rounded-xl text-ink placeholder:text-ink-muted/50 focus:border-rose-brand focus:ring-2 focus:ring-rose-brand/10 outline-none transition-all text-sm"
              required
            />
            <button
              type="submit"
              className="px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all btn-primary hover:scale-[1.02] active:scale-[0.98]"
            >
              <FiSend size={16} /> Subscribe
            </button>
          </motion.form>

          <motion.p
            className="text-xs text-ink-muted/50 mt-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
