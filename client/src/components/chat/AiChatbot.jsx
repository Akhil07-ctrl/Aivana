import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiStar } from 'react-icons/fi';
import axiosInstance from '../../api/axiosInstance';

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello style seeker! ✨ I'm your Aivana AI Stylist! Ask me for fashion tips, styling advice, or outfit recommendations." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await axiosInstance.post('/ai/chat', { message: userMsg });
      const { reply, products } = res.data.data;
      setMessages(prev => [...prev, { role: 'ai', text: reply, products }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Oops, I'm having trouble connecting to my styling database. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-14 h-14 md:w-16 md:h-16 bg-rose-brand text-white rounded-full shadow-[0_8px_30px_rgb(232,80,106,0.3)] flex items-center justify-center hover:scale-110 transition-transform z-50 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            <FiStar className="w-6 h-6 md:w-8 md:h-8 absolute animate-ping opacity-70 fill-white" />
            <FiMessageSquare size={24} className="relative z-10 md:w-7 md:h-7" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-4 right-4 left-4 md:left-auto md:bottom-6 md:right-6 md:w-[400px] h-[600px] max-h-[85vh] bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden z-50 border border-cream-200 pointer-events-auto"
          >
            {/* Header */}
            <div className="bg-ink p-5 flex justify-between items-center relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-brand opacity-20 blur-3xl rounded-full translate-x-10 -translate-y-10 pointer-events-none" />

              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-rose-brand rounded-full flex items-center justify-center shadow-lg">
                  <FiStar className="w-5 h-5 text-white fill-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-lg leading-none mb-1">Aivana AI</h3>
                  <p className="text-cream-300 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 block" /> Online Stylist
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors relative z-10">
                <FiX size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 bg-cream-50 p-5 overflow-y-auto flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${msg.role === 'user'
                      ? 'bg-ink text-white rounded-tr-sm shadow-md'
                      : 'bg-white text-ink rounded-tl-sm shadow-sm border border-cream-200'
                    }`}>
                    {/* Render basic bold formatting if present */}
                    {msg.text.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className={msg.role === 'ai' ? 'text-rose-brand' : ''}>{part}</strong> : part)}

                    {/* Suggested Products */}
                    {msg.products?.length > 0 && (
                      <div className="mt-4 space-y-3 pt-4 border-t border-cream-200">
                        <p className="text-[10px] font-bold text-ink-muted uppercase tracking-wider mb-2">Recommended for you:</p>
                        <div className="grid grid-cols-1 gap-3">
                          {msg.products.map(p => (
                            <Link 
                              key={p._id} 
                              to={`/products/${p.slug}`}
                              className="flex items-center gap-3 bg-cream-50 p-2 rounded-xl border border-cream-200 hover:border-rose-brand/30 transition-colors group/card"
                            >
                              <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={p.images?.[0]?.url} alt={p.name} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-ink truncate">{p.name}</p>
                                <p className="text-[10px] text-ink-muted font-bold mt-0.5">₹{p.price.toLocaleString()}</p>
                              </div>
                              <div className="text-rose-brand">
                                <FiStar size={12} className="fill-rose-brand" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-cream-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex gap-1.5 w-fit">
                    <div className="w-2 h-2 rounded-full bg-cream-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-cream-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-cream-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-cream-200">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for outfit ideas..."
                  className="w-full bg-cream-50 border border-cream-200 rounded-full pl-5 pr-14 py-3.5 text-sm text-ink focus:outline-none focus:border-rose-brand focus:ring-1 focus:ring-rose-brand transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 w-10 h-10 bg-ink hover:bg-rose-brand disabled:bg-cream-300 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <FiSend size={16} />
                </button>
              </form>
              <div className="text-center mt-3">
                <p className="text-[10px] text-ink-muted">AI Stylist can make mistakes. Consider checking our sizing guide.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
