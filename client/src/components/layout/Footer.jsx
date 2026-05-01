import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleComingSoon = (e) => {
    e.preventDefault();
    toast.success('Coming soon!', {
      icon: '✨',
      style: {
        borderRadius: '10px',
        background: '#1A1A2E',
        color: '#fff',
      },
    });
  };

  return (
    <footer className="bg-ink text-white pt-16 pb-8">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-12">

          <div className="md:col-span-1">
            <Link to="/" className="font-display font-bold text-3xl tracking-wide text-white">
              Aivana
            </Link>
            <p className="mt-4 text-cream-300/70 text-sm leading-relaxed max-w-xs">
              Redefining fashion for the modern era. Curated collections, AI-driven style concepts, and premium quality crafted for you.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white tracking-wider uppercase text-sm mb-6">Shop</h3>
            <ul className="space-y-3">
              {['New Arrivals', 'Best Sellers', 'Dresses', 'Accessories', 'Sale'].map(link => (
                <li key={link}>
                  <button onClick={handleComingSoon} className="text-cream-300/70 hover:text-rose-brand transition text-sm block text-left">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white tracking-wider uppercase text-sm mb-6">Help</h3>
            <ul className="space-y-3">
              {['Track Order', 'Returns & Exchanges', 'Shipping Info', 'FAQ', 'Contact Us'].map(link => (
                <li key={link}>
                  <button onClick={handleComingSoon} className="text-cream-300/70 hover:text-rose-brand transition text-sm block text-left">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white tracking-wider uppercase text-sm mb-6">Stay in the loop</h3>
            <p className="text-cream-300/70 text-sm mb-4">Subscribe for exclusive offers and AI fashion tips.</p>
            <form className="flex" onSubmit={handleComingSoon}>
              <input
                type="email"
                placeholder="Email address"
                className="bg-white/5 border border-white/10 rounded-l-lg px-4 py-2 text-white text-sm w-full focus:outline-none focus:border-rose-brand focus:bg-white/10 transition"
                required
              />
              <button type="submit" className="bg-rose-brand text-white px-4 py-2 rounded-r-lg font-medium hover:bg-rose-light transition">
                Join
              </button>
            </form>
          </div>

        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between text-xs text-cream-300/50">
          <p>&copy; {currentYear} Aivana. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <button onClick={handleComingSoon} className="hover:text-white transition">Privacy Policy</button>
            <button onClick={handleComingSoon} className="hover:text-white transition">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

