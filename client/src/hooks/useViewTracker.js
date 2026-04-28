import { useEffect, useRef } from 'react';
import axios from 'axios';

const useViewTracker = () => {
  const tracked = useRef(false);
  const sessionTracked = useRef(false);

  useEffect(() => {
    // Don't track if already tracked in this session
    if (sessionTracked.current) return;
    
    const trackView = async () => {
      try {
        // Check if this is an admin/owner
        const isAdmin = localStorage.getItem('adminToken') || 
                       sessionStorage.getItem('isAdmin') ||
                       document.cookie.includes('admin=true');
        
        // Don't track admin views
        if (isAdmin) {
          console.debug('Admin view - not tracked');
          return;
        }
        
        // Track only once per session
        sessionTracked.current = true;
        
        await axios.post(`${import.meta.env.VITE_API_URL}/api/views/track`, {
          page: window.location.pathname || 'home',
          referer: document.referrer || 'direct'
        });
      } catch (error) {
        console.debug('View tracking unavailable');
      }
    };

    trackView();
  }, []);
};

export default useViewTracker;