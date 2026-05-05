import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import AppRouter from './router/AppRouter';
import useAuthStore from './store/authStore';
import useCartStore from './store/cartStore';
import NamePromptModal from './components/auth/NamePromptModal';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function App() {
  const { fetchMe, user } = useAuthStore();
  const { fetchCart } = useCartStore();
  const [showNamePrompt, setShowNamePrompt] = useState(false);

  // Hydrate auth state on app mount
  useEffect(() => {
    fetchMe();

    // Listen for 401 from Axios interceptor
    const handle401 = () => {
      useAuthStore.getState().logout();
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
        <AppRouter />
      </AnimatePresence>

      {showNamePrompt && (
        <NamePromptModal onComplete={() => setShowNamePrompt(false)} />
      )}

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            borderRadius: '10px',
            background: '#1A1A2E',
            color: '#F1F1F1',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#E8506A', secondary: '#fff' } },
        }}
      />
    </QueryClientProvider>
  );
}

