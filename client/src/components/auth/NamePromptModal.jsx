import { useState } from 'react';
import { FiUser, FiArrowRight } from 'react-icons/fi';
import axiosInstance from '../../api/axiosInstance';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function NamePromptModal({ onComplete }) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Please enter your name');
    if (name.trim().length < 2) return toast.error('Name must be at least 2 characters');

    setIsLoading(true);
    try {
      const res = await axiosInstance.put('/users/profile', { name: name.trim() });
      setUser(res.data.data);
      toast.success(`Welcome, ${name.trim()}! 🎉`);
      onComplete();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update name');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="text-rose-brand" size={28} />
          </div>
          <h2 className="text-2xl font-display text-ink font-bold mb-2">Almost there!</h2>
          <p className="text-ink-muted text-sm">What should we call you? This helps us personalize your experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink-muted uppercase tracking-wider ml-1">
              Your Name
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink-muted group-focus-within:text-rose-brand transition-colors">
                <FiUser size={18} />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Akhil"
                className="input pl-11"
                required
                autoFocus
                maxLength={50}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-brand/10 group"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Continue <FiArrowRight className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
