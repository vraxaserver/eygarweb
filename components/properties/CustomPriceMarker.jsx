"use client";

import { OverlayViewF } from "@react-google-maps/api";

// This helper function helps correctly anchor the custom HTML overlay to the map coordinates.
// We are anchoring it to its bottom-center.
const getPixelPositionOffset = (width, height) => ({
  x: -(width / 2),
  y: -height,
});

const CustomPriceMarker = ({ property, isHovered, onMouseEnter, onMouseLeave, onClick }) => {
  const { location, price_per_night, currency } = property;
  
  // Use Intl.NumberFormat for robust currency formatting based on your data.
  const formattedPrice = new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: currency || 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price_per_night);

  return (
    <OverlayViewF
      position={{ lat: location.latitude, lng: location.longitude }}
      mapPaneName={OverlayViewF.OVERLAY_MOUSE_TARGET} // This makes the overlay clickable
      getPixelPositionOffset={getPixelPositionOffset}
    >
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        className={`
          flex items-center justify-center
          px-3 py-1 rounded-full shadow-lg cursor-pointer
          font-bold text-sm transition-all duration-200 transform
          ${isHovered 
            ? 'bg-black text-white scale-110 z-10' // Highlighted style
            : 'bg-white text-black' // Default style
          }
        `}
      >
        {formattedPrice}
      </div>
    </OverlayViewF>
  );
};

export default CustomPriceMarker;
