import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import authApi from '../../api/authApi';

export default function ForgotPasswordPage() {
  const location = useLocation();
  const [step, setStep] = useState(location.state?.step || 1); // 1 = Email, 2 = OTP & New Password
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.forgotPassword({ email });
      toast.success(res.data.message || 'OTP sent successfully!');
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      toast.error('Password must be at least 8 characters and include both letters and numbers');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.resetPassword({ email, otp, newPassword });
      toast.success(res.data.message || 'Password reset successful!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Check your OTP.');
    } finally {
      setIsLoading(false);
    }
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
            <h2 className="text-2xl font-display text-ink font-bold mb-2">Reset Password</h2>
            <p className="text-ink-muted text-sm">
              {step === 1 
                ? "Enter your email to receive a secure OTP" 
                : "Enter the OTP sent to your email and a new password"}
            </p>
          </div>

          {step === 1 ? (
            /* STEP 1: Request OTP */
            <form onSubmit={handleRequestOtp} className="space-y-5">
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

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 mt-2 shadow-lg shadow-rose-brand/10 group"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send OTP <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: Verify OTP and Reset Password */
            <form onSubmit={handleResetPassword} className="space-y-5 animate-fade-in">
              <div className="bg-cream-50 p-4 rounded-xl border border-cream-200 mb-6 flex items-start gap-3">
                <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-ink-muted leading-tight">
                    An OTP has been sent to <span className="font-bold text-ink">{email}</span>. It is valid for 10 minutes.
                  </p>
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-rose-brand hover:text-rose-dark mt-2 underline underline-offset-2"
                  >
                    Change Email
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-ink-muted uppercase tracking-wider ml-1">
                  6-Digit OTP
                </label>
                <div className="flex justify-between gap-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={otp[index] || ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (!val && e.nativeEvent.inputType !== 'deleteContentBackward') return;
                        
                        const newOtp = otp.split('');
                        newOtp[index] = val;
                        const joinedOtp = newOtp.join('').slice(0, 6);
                        setOtp(joinedOtp);

                        // Move to next input if value is entered
                        if (val && index < 5) {
                          document.getElementById(`otp-${index + 1}`)?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        // Move to previous input on backspace
                        if (e.key === 'Backspace' && !otp[index] && index > 0) {
                          document.getElementById(`otp-${index - 1}`)?.focus();
                        }
                      }}
                      className="w-12 h-14 text-center text-xl font-bold bg-cream-50 border-2 border-cream-200 rounded-xl focus:border-rose-brand focus:ring-0 transition-all text-ink"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-muted uppercase tracking-wider ml-1">
                  New Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink-muted group-focus-within:text-rose-brand transition-colors">
                    <FiLock size={18} />
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input pl-11"
                    required
                    minLength={8}
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
                    Reset Password <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-ink-muted text-sm font-medium">
            Remember your password?{' '}
            <Link to="/login" className="font-bold text-rose-brand hover:text-rose-dark transition-colors underline underline-offset-4">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
