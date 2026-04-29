import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please fill in all fields');
    }

    const result = await login({ email, password });
    if (result.success) {
      toast.success('Welcome back to Aivana!');
      navigate(redirect);
    } else {
      toast.error(result.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12 animate-fade-in">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-display text-ink tracking-tight">Aivana</h1>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <h2 className="text-3xl font-display text-ink mb-3">Welcome back</h2>
          <p className="text-ink-muted">Sign in to continue your journey</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider ml-1">
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

          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" title="Coming soon!" className="text-xs font-medium text-rose-brand hover:text-rose-dark transition-colors">
                Forgot password?
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
            className="btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-2 mt-4 shadow-lg shadow-rose-brand/20"
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

        {/* Footer */}
        <div className="mt-12 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-ink-muted">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-rose-brand hover:text-rose-dark transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
