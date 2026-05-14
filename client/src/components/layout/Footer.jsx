import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube } from 'react-icons/fi';

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

  const socialLinks = [
    { icon: FiInstagram, label: 'Instagram' },
    { icon: FiTwitter, label: 'Twitter' },
    { icon: FiFacebook, label: 'Facebook' },
    { icon: FiYoutube, label: 'Youtube' },
  ];

  const handleLinkClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-ink text-white pt-16 pb-8">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 border-b border-white/10 pb-12">

          <div className="md:col-span-1">
            <Link to="/" onClick={handleLinkClick} className="font-display font-bold text-3xl tracking-wide text-white">
              Aivana
            </Link>
            <p className="mt-4 text-cream-300/70 text-sm leading-relaxed max-w-xs">
              Redefining fashion for the modern era. Curated collections, AI-driven style concepts, and premium quality crafted for you.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white tracking-wider uppercase text-sm mb-6">Shop</h3>
            <ul className="space-y-3">
              {[
                { label: 'New Arrivals', path: '/shop?sort=newest' },
                { label: 'Men', path: '/shop?category=Men' },
                { label: 'Women', path: '/shop?category=Women' },
                { label: 'Trending', path: '/shop?isTrending=true' },
                { label: 'Sale', path: '/shop?category=Sale' }
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.path} onClick={handleLinkClick} className="text-cream-300/70 hover:text-rose-brand transition text-sm block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white tracking-wider uppercase text-sm mb-6">Help</h3>
            <ul className="space-y-3">
              <li key="Track Order">
                <Link to="/profile#orders" onClick={handleLinkClick} className="text-cream-300/70 hover:text-rose-brand transition text-sm block">
                  Track Order
                </Link>
              </li>
              {['Returns & Exchanges', 'Shipping Info'].map(link => (
                <li key={link}>
                  <button onClick={handleComingSoon} className="text-cream-300/70 hover:text-rose-brand transition text-sm block text-left">
                    {link}
                  </button>
                </li>
              ))}
              <li key="FAQ">
                <Link to="/faq" onClick={handleLinkClick} className="text-cream-300/70 hover:text-rose-brand transition text-sm block">
                  FAQ
                </Link>
              </li>
              <li key="Contact Us">
                <Link to="/contact" onClick={handleLinkClick} className="text-cream-300/70 hover:text-rose-brand transition text-sm block">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white tracking-wider uppercase text-sm mb-6">Connect</h3>
            <p className="text-cream-300/70 text-sm mb-6">Join our community and share your #AivanaStyle.</p>
            <div className="flex gap-4">
              {socialLinks.map(social => (
                <button
                  key={social.label}
                  onClick={handleComingSoon}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-rose-brand hover:text-white transition-all border border-white/10 group"
                  title={social.label}
                >
                  <social.icon size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="sr-only">{social.label}</span>
                </button>
              ))}
            </div>
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

