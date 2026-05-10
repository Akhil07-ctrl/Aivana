import { useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

export default function GoogleOneTap() {
  const { user, isInitialized, setUser } = useAuthStore();

  useEffect(() => {
    // Only run if user is not logged in and auth is initialized
    if (!isInitialized || user) return;

    const handleGoogleResponse = async (response) => {
      try {
        const { data } = await axiosInstance.post('/auth/google-one-tap', {
          credential: response.credential
        });
        
        if (data?.data) {
          setUser(data.data);
          // Sync guest cart to server after successful login
          try {
            await useCartStore.getState().syncCartWithServer();
          } catch (syncError) {
            console.error('Cart sync error after Google login:', syncError);
          }
          toast.success(`Welcome back, ${data.data.name}!`);
        }
      } catch (error) {
        console.error('Google One Tap Error:', error);
        // We don't show an error toast here to avoid annoying the user if it fails silently
      }
    };

    const initializeOneTap = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false, // Set to true if you want it to be even more automatic
          cancel_on_tap_outside: true
        });

        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            console.log('One Tap not displayed:', notification.getNotDisplayedReason());
          }
        });
      }
    };

    // Wait for the Google script to load if it's not already there
    if (!window.google) {
      const interval = setInterval(() => {
        if (window.google) {
          initializeOneTap();
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    } else {
      initializeOneTap();
    }
  }, [user, isInitialized, setUser]);

  return null; // This component doesn't render anything visible
}
