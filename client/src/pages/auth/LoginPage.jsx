import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiPhone } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../config/firebase';

const RESEND_TIMER = 30; // seconds

export default function LoginPage() {
  const [authMethod, setAuthMethod] = useState('email'); // 'email' | 'phone'
  
  // Email states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Phone states
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Resend timer
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef(null);

  const { login, firebaseLogin, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  // Setup recaptcha
  useEffect(() => {
    try {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    } catch (err) {
      console.warn('RecaptchaVerifier setup skipped:', err.message);
    }

    return () => {
      try {
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        }
      } catch (err) { /* ignore */ }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer countdown
  const startResendTimer = useCallback(() => {
    setResendTimer(RESEND_TIMER);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) return toast.error('Please fill in all fields');
    if (!emailRegex.test(email)) return toast.error('Please enter a valid email address');

    try {
      const result = await login({ email, password });
      if (result) navigate(redirect);
    } catch (error) {
      // Handled in store
    }
  };

  const sendOtp = async () => {
    const formattedPhone = `+91${phone.replace(/\D/g, '')}`;

    if (phone.replace(/\D/g, '').length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSendingOtp(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setVerificationId(confirmationResult);
      setIsOtpSent(true);
      startResendTimer();
      toast.success(`OTP sent to ${formattedPhone}`);
    } catch (error) {
      console.error('Send OTP Error:', error);
      if (error.code === 'auth/invalid-phone-number') {
        toast.error('Invalid phone number. Enter 10 digits without country code.');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many attempts. Please try again later.');
      } else if (error.code === 'auth/quota-exceeded') {
        toast.error('SMS quota exceeded. Try again later.');
      } else {
        toast.error(`Failed to send OTP: ${error.message}`);
      }
      // Reset reCAPTCHA for retry
      try {
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        }
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
      } catch (err) { /* ignore */ }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone) return toast.error('Please enter your phone number');
    await sendOtp();
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setOtp('');
    await sendOtp();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error('Please enter the OTP');

    try {
      const result = await verificationId.confirm(otp);
      const idToken = await result.user.getIdToken();
      const loginResult = await firebaseLogin(idToken);
      if (loginResult) navigate(redirect);
    } catch (error) {
      toast.error('Invalid or expired OTP. Please try again.');
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `${import.meta.env.VITE_API_URL || '/api'}/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-4 py-12">
      <div id="recaptcha-container"></div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-block group">
            <h1 className="text-4xl font-display text-ink tracking-tight group-hover:text-rose-brand transition-colors">Aivana</h1>
          </Link>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl shadow-ink/5 animate-slide-up">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-display text-ink font-bold mb-2">Welcome back</h2>
            <p className="text-ink-muted text-sm">Sign in to continue your curated journey</p>
          </div>

          <button
            onClick={() => handleSocialLogin('google')}
            className="w-full flex items-center justify-center gap-3 py-3 border border-cream-300 rounded-2xl font-semibold text-ink hover:bg-cream-50 transition-all duration-200 mb-6"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          {/* Custom Tabs */}
          <div className="flex bg-cream-100 rounded-xl p-1 mb-8">
            <button 
              onClick={() => { setAuthMethod('email'); setIsOtpSent(false); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMethod === 'email' ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'}`}
            >
              Email
            </button>
            <button 
              onClick={() => setAuthMethod('phone')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMethod === 'phone' ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'}`}
            >
              Phone
            </button>
          </div>

          {authMethod === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-muted uppercase tracking-wider ml-1">Email address</label>
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
                  <label className="text-xs font-bold text-ink-muted uppercase tracking-wider">Password</label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-rose-brand hover:text-rose-dark transition-colors">
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
                  <>Sign In <FiArrowRight className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="space-y-5 animate-fade-in">
              {!isOtpSent ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink-muted uppercase tracking-wider ml-1">Phone Number</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink-muted group-focus-within:text-rose-brand transition-colors">
                        <span className="text-sm font-semibold text-ink select-none">+91</span>
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="98765 43210"
                        className="input pl-14"
                        required
                        maxLength={10}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 mt-2 shadow-lg shadow-rose-brand/10 group"
                  >
                    {isSendingOtp ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Send OTP <FiArrowRight className="group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                </>
              ) : (
                <>
                  {/* OTP Sent confirmation */}
                  <div className="bg-cream-50 p-4 rounded-xl border border-cream-200 flex items-start gap-3">
                    <FiPhone className="text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-ink-muted leading-tight">
                        OTP sent to <span className="font-bold text-ink">+91 {phone}</span>
                      </p>
                      <button 
                        type="button" 
                        onClick={() => { setIsOtpSent(false); setOtp(''); }}
                        className="text-xs font-bold text-rose-brand hover:text-rose-dark mt-2 underline underline-offset-2"
                      >
                        Change Number
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-ink-muted uppercase tracking-wider ml-1">Enter OTP</label>
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
                          className="w-full h-14 text-center text-xl font-bold bg-cream-50 border-2 border-cream-200 rounded-xl focus:border-rose-brand focus:ring-0 transition-all text-ink"
                        />
                      ))}
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
                      <>Verify & Sign In <FiArrowRight className="group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>

                  {/* Resend OTP */}
                  <div className="text-center pt-2">
                    {resendTimer > 0 ? (
                      <p className="text-sm text-ink-muted">
                        Resend OTP in <span className="font-bold text-ink">{resendTimer}s</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isSendingOtp}
                        className="text-sm font-bold text-rose-brand hover:text-rose-dark transition-colors underline underline-offset-4"
                      >
                        {isSendingOtp ? 'Sending...' : 'Resend OTP'}
                      </button>
                    )}
                  </div>
                </>
              )}
            </form>
          )}
        </div>

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
