import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus, FiSearch, FiMessageCircle, FiTruck, FiCornerUpLeft, FiCreditCard } from 'react-icons/fi';
import PageWrapper from '../../components/layout/PageWrapper';
import contactVideo from '../../assets/Contact_Video.mp4';

const faqs = [
  {
    category: 'Orders & Shipping',
    icon: <FiTruck />,
    questions: [
      {
        q: 'How long will it take to receive my order?',
        a: 'Standard shipping typically takes 3-5 business days within major metropolitan areas. For Tier 2 and Tier 3 cities, please allow 5-7 business days. You will receive a tracking link as soon as your order is dispatched.'
      },
      {
        q: 'Can I change my shipping address after placing an order?',
        a: 'We can update your address if the order has not yet been processed by our warehouse (usually within 2 hours of placement). Please contact our support team immediately for such requests.'
      },
      {
        q: 'Do you offer international shipping?',
        a: 'Currently, Aivana ships exclusively within India. We are working on expanding our reach to global fashion enthusiasts soon.'
      }
    ]
  },
  {
    category: 'Returns & Exchanges',
    icon: <FiCornerUpLeft />,
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 7-day hassle-free return policy for most items. The product must be unused, unwashed, and have all original tags and packaging intact.'
      },
      {
        q: 'How do I initiate a return or exchange?',
        a: 'You can initiate a return directly from your Profile > Orders section. Select the order and click on "Return/Exchange". Our courier partner will pick up the item within 48 hours.'
      }
    ]
  },
  {
    category: 'Payments & Security',
    icon: <FiCreditCard />,
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit/debit cards, UPI (GPay, PhonePe, Paytm), Net Banking, and select digital wallets via our secure payment partner, Razorpay.'
      },
      {
        q: 'Is my payment information secure?',
        a: 'Absolutely. Aivana does not store your card details. All transactions are processed through 128-bit encrypted SSL layers, ensuring the highest level of security.'
      }
    ]
  }
];

const FaqItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className={`border-b border-cream-200 transition-all duration-300 ${isOpen ? 'bg-cream-50/50' : 'hover:bg-cream-50/30'}`}>
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-rose-brand' : 'text-ink group-hover:text-rose-brand'}`}>
          {question}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-rose-brand text-white rotate-180' : 'bg-cream-100 text-ink-muted group-hover:bg-rose-brand/10 group-hover:text-rose-brand'}`}>
          {isOpen ? <FiMinus /> : <FiPlus />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-8 pr-12 text-ink-muted leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FaqPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState('0-0');
  const resultsRef = useRef(null);

  // Remove auto-scroll to avoid conflict with sticky search
  // useEffect logic removed as requested for the new layout concept


  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q =>
      q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <PageWrapper className="bg-white" noY={true}>
      {/* Dynamic Hero Section */}
      <section
        className={`bg-ink transition-all duration-500 ease-in-out relative z-30 ${searchTerm
            ? 'sticky top-[88px] py-8 shadow-2xl'
            : 'pt-32 pb-20 lg:pt-40 lg:pb-32'
          }`}
      >
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-20 grayscale brightness-50"
          >
            <source src={contactVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
        </div>
        <div className="container-main relative z-10">
          <div className={`${searchTerm ? 'max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-8' : 'max-w-3xl'}`}>
            <AnimatePresence mode="wait">
              {!searchTerm && (
                <motion.div
                  initial={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-px bg-rose-brand" />
                    <span className="text-rose-brand text-[10px] font-bold uppercase tracking-[0.25em]">Support Center</span>
                  </div>
                  <h1 className="text-5xl lg:text-7xl font-display font-bold text-white mb-8">
                    How can we <br />
                    <span className="italic text-rose-brand">Help you?</span>
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              layout
              className={`relative ${searchTerm ? 'w-full' : 'max-w-xl'}`}
            >
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input
                type="text"
                placeholder="Search for questions, topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white placeholder:text-white/30 focus:bg-white/20 focus:border-rose-brand/50 outline-none transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-rose-brand uppercase tracking-widest hover:text-white transition-colors"
                >
                  Clear
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section ref={resultsRef} id="faq-results" className="py-24 bg-white">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-4 space-y-4">
              <div className="sticky top-32">
                <h3 className="text-xs font-bold text-ink-muted uppercase tracking-[0.2em] mb-8 ml-2">Categories</h3>
                <div className="space-y-2">
                  {faqs.map((cat, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(`cat-${i}`);
                        if (element) {
                          const yOffset = -100;
                          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

                          window.scrollTo({
                            top: y,
                            behavior: 'smooth'
                          });

                          // Open the first question AFTER the scroll has started and settled slightly
                          setTimeout(() => {
                            setOpenIndex(`${i}-0`);
                          }, 300);
                        }
                      }}
                      className="w-full flex items-center gap-4 p-5 rounded-2xl border border-cream-100 hover:border-rose-brand/30 hover:bg-rose-50/30 transition-all text-left group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-cream-50 flex items-center justify-center text-ink-muted group-hover:bg-rose-brand group-hover:text-white transition-all">
                        {cat.icon}
                      </div>
                      <span className="font-bold text-ink">{cat.category}</span>
                    </button>
                  ))}
                </div>

                {/* Contact Card */}
                <div className="mt-12 p-8 rounded-[2.5rem] bg-ink text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-brand/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                  <FiMessageCircle size={40} className="text-rose-brand mb-6" />
                  <h4 className="text-xl font-bold mb-2">Still have questions?</h4>
                  <p className="text-sm text-white/60 mb-8 leading-relaxed">Our dedicated support team is available 24/7 to assist you with any inquiries.</p>
                  <a href="/contact" className="inline-block w-full text-center py-4 rounded-xl bg-rose-brand font-bold text-sm hover:bg-rose-600 transition-all">Contact Us</a>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="lg:col-span-8">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((cat, catIdx) => (
                  <div key={catIdx} id={`cat-${catIdx}`} className="mb-20 last:mb-0">
                    <h2 className="text-2xl font-display font-bold text-ink mb-10 flex items-center gap-4">
                      <span className="w-8 h-8 rounded-lg bg-cream-100 flex items-center justify-center text-sm text-rose-brand">
                        {catIdx + 1}
                      </span>
                      {cat.category}
                    </h2>
                    <div className="space-y-2">
                      {cat.questions.map((q, qIdx) => (
                        <FaqItem
                          key={qIdx}
                          question={q.q}
                          answer={q.a}
                          isOpen={openIndex === `${catIdx}-${qIdx}`}
                          onClick={() => setOpenIndex(openIndex === `${catIdx}-${qIdx}` ? null : `${catIdx}-${qIdx}`)}
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-cream-50 rounded-full flex items-center justify-center mx-auto mb-6 text-ink-muted">
                    <FiSearch size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-ink mb-2">No results found</h3>
                  <p className="text-ink-muted">We couldn't find any questions matching your search term.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
