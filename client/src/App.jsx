import { useEffect, useState, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import AppRouter from './router/AppRouter';
import useAuthStore from './store/authStore';
import useCartStore from './store/cartStore';
import NamePromptModal from './components/auth/NamePromptModal';
import GoogleOneTap from './components/auth/GoogleOneTap';
import LoadingScreen from './components/ui/LoadingScreen';
import FlyToCart from './components/ui/FlyToCart';
import ShareModal from './components/ui/ShareModal';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function App() {
  const { fetchMe, user, isInitialized } = useAuthStore();
  const { fetchCart } = useCartStore();
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [toastPosition, setToastPosition] = useState('bottom-right');

  // Handle toast position based on screen size
  useEffect(() => {
    const handleResize = () => {
      setToastPosition(window.innerWidth <= 1024 ? 'top-center' : 'bottom-right');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hydrate auth state on app mount
  useEffect(() => {
    fetchMe();

    // Listen for 401 from Axios interceptor
    const handle401 = () => {
      const { user, logout } = useAuthStore.getState();
      if (user) {
        toast.error('Your session has expired. Please log in again.');
      }
      logout();
    };
    window.addEventListener('auth:unauthorized', handle401);
    return () => window.removeEventListener('auth:unauthorized', handle401);
  }, [fetchMe]);

  // Fetch cart automatically when user is logged in
  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  // Show name prompt for new phone-auth users
  useEffect(() => {
    if (user && user.name === 'New User') {
      setShowNamePrompt(true);
    } else {
      setShowNamePrompt(false);
    }
  }, [user]);

  return (
    <QueryClientProvider client={queryClient}>
      <AnimatePresence mode="wait">
        {!isInitialized ? (
          <LoadingScreen key="loader" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AppRouter />
          </motion.div>
        )}
      </AnimatePresence>
      <FlyToCart />
      <ShareModal />
      <GoogleOneTap />

      {showNamePrompt && (
        <NamePromptModal onComplete={() => setShowNamePrompt(false)} />
      )}

      <Toaster
        position={toastPosition}
        containerStyle={{
          top: toastPosition === 'top-center' ? 80 : 40,
          bottom: 40,
        }}
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#1A1A2E',
            color: '#F1F1F1',
            fontSize: '14px',
            fontWeight: '600',
            padding: '12px 20px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: { iconTheme: { primary: '#E8506A', secondary: '#fff' } },
        }}
      />
    </QueryClientProvider>
  );
}

