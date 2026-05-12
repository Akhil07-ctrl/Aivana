import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';
import PageWrapper from '../../components/layout/PageWrapper';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post('/support/contact', formData);
      setSubmitted(true);
      toast.success('Message sent! We\'ll get back to you soon.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <PageWrapper className="bg-white min-h-screen flex items-center justify-center">
        <div className="container-main max-w-2xl text-center py-20">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/10"
          >
            <FiCheckCircle size={48} />
          </motion.div>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-ink mb-6">Message Received!</h1>
          <p className="text-ink-muted text-lg leading-relaxed mb-10">
            Thank you for reaching out to Aivana. Our support concierge has received your inquiry and will respond to you within the next 24 business hours.
          </p>
          <button
            onClick={() => {
              setFormData({
                name: '',
                email: '',
                subject: 'General Inquiry',
                message: ''
              });
              setSubmitted(false);
            }}
            className="btn-primary px-10 py-4"
          >
            Send Another Message
          </button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="bg-white">
      {/* Hero Section */}
      <section className="bg-ink pt-32 pb-20 lg:pt-40 lg:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
            alt="Office" 
            className="w-full h-full object-cover opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent" />
        </div>
        
        <div className="container-main relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <div className="w-12 h-px bg-rose-brand" />
              <span className="text-rose-brand text-[10px] font-bold uppercase tracking-[0.3em]">Contact Us</span>
              <div className="w-12 h-px bg-rose-brand" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-7xl font-display font-bold text-white mb-8"
            >
              Let's Start a <br />
              <span className="italic text-rose-brand">Conversation.</span>
            </motion.h1>
          </div>
        </div>
      </section>

      <section className="py-24 -mt-16 lg:-mt-24 relative z-20">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Contact Information */}
            <div className="lg:col-span-5">
              <div className="bg-white p-10 lg:p-14 rounded-[3rem] shadow-2xl shadow-cream-200 border border-cream-100 h-full">
                <h3 className="text-3xl font-display font-bold text-ink mb-10">Contact Information</h3>
                
                <div className="space-y-10">
                  <div className="flex gap-6">
                    <div className="w-14 h-14 bg-cream-50 rounded-2xl flex items-center justify-center text-rose-brand flex-shrink-0 group hover:bg-rose-brand hover:text-white transition-all duration-300">
                      <FiMail size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-1">Email Us</p>
                      <a href="mailto:support@aivana.com" className="text-lg font-bold text-ink hover:text-rose-brand transition-colors">support@aivana.com</a>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-14 h-14 bg-cream-50 rounded-2xl flex items-center justify-center text-rose-brand flex-shrink-0 group hover:bg-rose-brand hover:text-white transition-all duration-300">
                      <FiPhone size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-1">Call Us</p>
                      <a href="tel:+919876543210" className="text-lg font-bold text-ink hover:text-rose-brand transition-colors">+91 98765 43210</a>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-14 h-14 bg-cream-50 rounded-2xl flex items-center justify-center text-rose-brand flex-shrink-0 group hover:bg-rose-brand hover:text-white transition-all duration-300">
                      <FiMapPin size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-1">Visit Us</p>
                      <p className="text-lg font-bold text-ink">Design Studio, HSR Layout, Bangalore - 560102</p>
                    </div>
                  </div>

                  <div className="pt-10 border-t border-cream-100">
                    <div className="flex items-center gap-3 text-ink-muted">
                      <FiClock className="text-rose-brand" />
                      <span className="text-sm font-semibold">Response time: Within 24 hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-10 lg:p-14 rounded-[3rem] shadow-2xl shadow-cream-200 border border-cream-100 h-full">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] ml-1">Full Name</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your Name"
                        className="w-full px-6 py-4 rounded-2xl border border-cream-100 bg-cream-50/30 focus:bg-white focus:border-rose-brand transition-all outline-none font-semibold text-sm"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] ml-1">Email Address</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-6 py-4 rounded-2xl border border-cream-100 bg-cream-50/30 focus:bg-white focus:border-rose-brand transition-all outline-none font-semibold text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] ml-1">Subject</label>
                    <div className="relative">
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl border border-cream-200 bg-cream-50/30 focus:bg-white focus:border-rose-brand transition-all outline-none font-semibold text-sm appearance-none cursor-pointer"
                      >
                        <option>General Inquiry</option>
                        <option>Order Support</option>
                        <option>Business Collaboration</option>
                        <option>Styling Advice</option>
                        <option>Returns & Exchanges</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-rose-brand">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] ml-1">Message</label>
                    <textarea
                      required
                      rows="6"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we help you today?"
                      className="w-full px-6 py-4 rounded-2xl border border-cream-100 bg-cream-50/30 focus:bg-white focus:border-rose-brand transition-all outline-none font-semibold text-sm resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-3 text-base group"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
