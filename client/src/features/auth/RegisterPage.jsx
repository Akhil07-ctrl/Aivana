import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      return toast.error('Please fill in all fields');
    }

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    const result = await register({ name, email, password });
    if (result.success) {
      toast.success('Account created successfully! Welcome to Aivana.');
      navigate('/');
    } else {
      toast.error(result.error || 'Registration failed');
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
          <h2 className="text-3xl font-display text-ink mb-3">Join Aivana</h2>
          <p className="text-ink-muted">Create an account to start your style journey</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider ml-1">
              Full Name
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink-muted group-focus-within:text-rose-brand transition-colors">
                <FiUser size={18} />
              </div>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="input pl-11"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider ml-1">
              Email address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink-muted group-focus-within:text-rose-brand transition-colors">
                <FiMail size={18} />
              </div>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input pl-11"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink-muted group-focus-within:text-rose-brand transition-colors">
                <FiLock size={18} />
              </div>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input pl-11"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider ml-1">
              Confirm Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink-muted group-focus-within:text-rose-brand transition-colors">
                <FiLock size={18} />
              </div>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
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
                Create Account <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-10 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-ink-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-rose-brand hover:text-rose-dark transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
