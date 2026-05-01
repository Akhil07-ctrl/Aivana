import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCopy, FiCheck, FiShare2, FiMail } from 'react-icons/fi';
import { FaWhatsapp, FaTelegramPlane, FaTwitter, FaFacebook } from 'react-icons/fa';
import toast from 'react-hot-toast';

const socialPlatforms = [
  {
    name: 'WhatsApp',
    color: 'bg-green-50 hover:bg-green-100 text-green-700',
    icon: FaWhatsapp,
    getLink: (url, title) => `https://wa.me/?text=${encodeURIComponent(title + '\n' + url)}`
  },
  {
    name: 'Telegram',
    color: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
    icon: FaTelegramPlane,
    getLink: (url, title) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
  },
  {
    name: 'Twitter',
    color: 'bg-sky-50 hover:bg-sky-100 text-sky-700',
    icon: FaTwitter,
    getLink: (url, title) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  },
  {
    name: 'Facebook',
    color: 'bg-blue-50 hover:bg-blue-100 text-blue-600',
    icon: FaFacebook,
    getLink: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  },
  {
    name: 'Email',
    color: 'bg-gray-50 hover:bg-gray-100 text-gray-700',
    icon: FiMail,
    getLink: (url, title) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(title + '\n' + url)}`
  }
];

export default function ShareModal({ isOpen, onClose, product }) {
  const [copied, setCopied] = useState(false);
  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  if (!product) return null;

  const productUrl = `${window.location.origin}/products/${product.slug}`;
  const shareTitle = product.name;
  const shareText = `Check out this amazing product: ${product.name}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = productUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = (platform) => {
    const url = platform.getLink(productUrl, shareTitle);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: productUrl
      });
      onClose();
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
        toast.error('Something went wrong while sharing');
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-cream-200">
              <h3 className="text-lg font-bold text-ink">Share Product</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream-100 transition"
              >
                <FiX size={20} className="text-ink" />
              </button>
            </div>

            {/* Product Preview */}
            <div className="px-4 py-3 bg-cream-50 flex items-center gap-3">
              <img
                src={product.images?.[0]?.url || product.images?.find(img => img.isPrimary)?.url || 'https://via.placeholder.com/100x100?text=No+Image'}
                alt={product.name}
                className="w-14 h-14 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink text-sm truncate">{product.name}</p>
                <p className="text-rose-brand font-bold text-sm">₹{product.price?.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Share Options */}
            <div className="p-4">
              {/* Native Share Button */}
              {canNativeShare && (
                <button
                  onClick={handleNativeShare}
                  className="w-full mb-4 p-3 bg-rose-brand text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 hover:bg-rose-brand/90"
                >
                  <FiShare2 size={18} />
                  Share via Device
                </button>
              )}

              {/* Divider */}
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-cream-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-ink-muted uppercase tracking-wider">
                    {canNativeShare ? 'Or share via' : 'Share via'}
                  </span>
                </div>
              </div>

              {/* Social Platforms */}
              <div className="grid grid-cols-3 gap-2">
                {socialPlatforms.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <button
                      key={platform.name}
                      onClick={() => handleShare(platform)}
                      className={`p-3 rounded-lg font-semibold text-sm text-center transition flex flex-col items-center gap-1.5 ${platform.color}`}
                    >
                      <Icon size={20} />
                      {platform.name}
                    </button>
                  );
                })}
              </div>

              {/* Copy Link Button */}
              <button
                onClick={handleCopyLink}
                className="w-full mt-4 p-3 bg-ink text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 hover:bg-ink/90"
              >
                {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
