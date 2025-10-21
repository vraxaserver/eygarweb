import { useState, useEffect } from 'react';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const GOOGLE_MAPS_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;

/**
 * Custom hook to load the Google Maps script dynamically.
 * @returns {boolean} True if the script is loaded and ready, false otherwise.
 */
const useGoogleMapsScript = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = GOOGLE_MAPS_URL;
    script.async = true;
    script.defer = true;
    
    // Global function used as a callback when the script loads
    window.initMap = () => {
        setIsLoaded(true);
        console.log("Google Maps script loaded.");
    };

    script.onerror = () => {
        console.error("Failed to load Google Maps script.");
    };

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Clean up the global callback and the script if necessary
      delete window.initMap; 
      // Note: Removing the script itself is often complex and unnecessary 
      // as it's typically loaded once per page.
    };
  }, []); // Empty dependency array ensures it runs only once

  return isLoaded;
};

export default useGoogleMapsScript;
