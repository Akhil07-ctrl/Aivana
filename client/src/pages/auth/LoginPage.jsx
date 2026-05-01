import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return false;
    }
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await login({ email, password });
      // The store handles toasts and returns data or throws
      if (result) {
        navigate(redirect);
      }
    } catch (error) {
      // Error is already toasted in store
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `${import.meta.env.VITE_API_URL || '/api'}/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10 animate-fade-in">
          <Link to="/" className="inline-block group">
            <h1 className="text-4xl font-display text-ink tracking-tight group-hover:text-rose-brand transition-colors">Aivana</h1>
          </Link>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl shadow-ink/5 animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-display text-ink font-bold mb-2">Welcome back</h2>
            <p className="text-ink-muted text-sm">Sign in to continue your curated journey</p>
          </div>

          {/* Social Login */}
          <button
            onClick={() => handleSocialLogin('google')}
            className="w-full flex items-center justify-center gap-3 py-3 border border-cream-300 rounded-2xl font-semibold text-ink hover:bg-cream-50 transition-all duration-200 mb-6"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cream-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-ink-muted font-semibold tracking-widest">Or with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-muted uppercase tracking-wider ml-1">
                Email address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink-muted group-focus-within:text-rose-brand transition-colors">
                  <FiMail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input pl-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-ink-muted uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" core-title="Coming soon!" className="text-xs font-semibold text-rose-brand hover:text-rose-dark transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink-muted group-focus-within:text-rose-brand transition-colors">
                  <FiLock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-11"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 mt-2 shadow-lg shadow-rose-brand/10 group"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-ink-muted text-sm font-medium">
            New to Aivana?{' '}
            <Link to="/register" className="font-bold text-rose-brand hover:text-rose-dark transition-colors underline underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
