import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop - A utility component that resets the scroll position to the top
 * of the page whenever the route changes. This is essential for SPAs to mimic
 * browser behavior of multi-page websites.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset scroll to top-left of the window
    window.scrollTo(0, 0);
    
    // Also reset any specific scrollable containers if needed
    // (though usually window.scrollTo is enough for standard layouts)
  }, [pathname]);

  return null; // This component doesn't render any UI
}
