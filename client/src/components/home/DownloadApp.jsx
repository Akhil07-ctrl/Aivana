import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSmartphone, FiZap, FiBell, FiGift } from 'react-icons/fi';

const features = [
  { icon: FiZap, title: 'Lightning Fast', desc: 'Blazing fast browsing and checkout experience' },
  { icon: FiBell, title: 'Smart Alerts', desc: 'Get notified on drops, deals and restocks' },
  { icon: FiGift, title: 'App-Only Offers', desc: 'Exclusive discounts only for app users' },
];

export default function DownloadApp() {
  const handleDownload = () => {
    toast('Our app is coming soon! Stay tuned.', {
      icon: '✨',
      style: {
        borderRadius: '12px',
        background: '#1A1A2E',
        color: '#F1F1F1',
        fontSize: '14px',
      },
      duration: 3000,
    });
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-ink via-[#1a1a3e] to-ink relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-brand/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/[0.03] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/[0.05] rounded-full" />

      <div className="container-main relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

          {/* Left: Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 bg-rose-brand/20 text-rose-brand text-xs font-bold uppercase tracking-widest rounded-full mb-6 border border-rose-brand/20">
                Coming Soon
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Shop Smarter.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-brand to-pink-400">
                  Download Our App.
                </span>
              </h2>
              <p className="text-cream-300/70 text-lg max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
                Get the full Aivana experience on your phone. Browse, style, and shop with AI-powered recommendations — all at your fingertips.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/10">
                    <f.icon size={18} className="text-rose-brand" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{f.title}</p>
                    <p className="text-cream-300/50 text-xs mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Download Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto group flex items-center gap-3 bg-white text-ink px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl font-bold hover:bg-cream-50 transition-all shadow-xl shadow-black/20 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" className="sm:w-6 sm:h-6">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <div className="text-left">
                  <p className="text-[9px] sm:text-[10px] text-ink-muted uppercase tracking-wider leading-none">Download on the</p>
                  <p className="text-sm sm:text-base font-bold leading-tight">App Store</p>
                </div>
              </button>

              <button
                onClick={handleDownload}
                className="w-full sm:w-auto group flex items-center gap-3 bg-white/10 text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl font-bold border border-white/20 hover:bg-white/20 transition-all hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="sm:w-[22px] sm:h-[22px]">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.2l2.302 2.302a1 1 0 0 1 0 1.382l-2.302 2.302L15.21 12l2.488-2.493zM5.864 2.658L16.8 9.491l-2.302 2.302L5.864 3.158z" />
                </svg>
                <div className="text-left">
                  <p className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-wider leading-none">Get it on</p>
                  <p className="text-sm sm:text-base font-bold leading-tight">Google Play</p>
                </div>
              </button>
            </motion.div>
          </div>

          {/* Right: Phone Mockup */}
          <motion.div
            className="flex-shrink-0 relative"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative w-64 h-[520px] mx-auto">
              {/* Phone Frame */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 rounded-[3rem] border border-white/20 shadow-2xl shadow-black/30 backdrop-blur-xl overflow-hidden">
                {/* Status Bar */}
                <div className="flex items-center justify-between px-8 pt-4 pb-2">
                  <span className="text-white/60 text-[10px] font-bold">9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-2 border border-white/40 rounded-sm">
                      <div className="w-3/4 h-full bg-white/40 rounded-sm" />
                    </div>
                  </div>
                </div>
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-b-2xl" />

                {/* App Content Preview */}
                <div className="px-5 pt-6">
                  <div className="text-center mb-6">
                    <h3 className="font-display text-xl font-bold text-white tracking-wider">AIVANA</h3>
                    <p className="text-white/30 text-[9px] uppercase tracking-[0.3em] mt-1">Fashion Redefined</p>
                  </div>

                  {/* Mini Product Cards */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="aspect-[3/4] rounded-xl bg-white/10 border border-white/10 overflow-hidden">
                        <div className="w-full h-3/4 bg-gradient-to-br from-white/5 to-white/[0.02]" />
                        <div className="p-1.5">
                          <div className="w-3/4 h-1.5 bg-white/15 rounded-full mb-1" />
                          <div className="w-1/2 h-1.5 bg-rose-brand/30 rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mini Nav Bar */}
                  <div className="flex items-center justify-around py-3 border-t border-white/10 mt-2">
                    {['🏠', '🔍', '👜', '❤️', '👤'].map((icon, i) => (
                      <span key={i} className={`text-sm ${i === 0 ? 'opacity-100' : 'opacity-30'}`}>{icon}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-rose-brand/20 rounded-[3.5rem] blur-2xl -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
