// components/PropertyMap.tsx
'use client';

import { GoogleMap, useJsApiLoader, OverlayView, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';
import Image from 'next/image';
import { useGoogleMaps } from '@/providers/GoogleMapsProvider';



const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};

const defaultCenter = {
  lat: 41.0082,
  lng: 28.9784,
};


export default function PropertyMap({properties}) {
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const { isLoaded } = useGoogleMaps();

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
  };

  const handleCloseInfoWindow = () => {
    setSelectedProperty(null);
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={defaultCenter}
      zoom={12}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      }}
      onClick={handleCloseInfoWindow}
    >
      {properties.map((property) => (
        <OverlayView
          key={property.id}
          position={{ lat: property.location.latitude, lng: property.location.longitude }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div
            className={`
              px-3 py-1.5 rounded-full font-semibold text-sm
              bg-white border-2 shadow-md
              cursor-pointer transition-all
              hover:scale-110 hover:z-10 hover:shadow-xl
              ${
                hoveredId === property.id || selectedProperty?.id === property.id
                  ? 'bg-gray-900 text-white border-gray-900 scale-110'
                  : 'text-gray-900 border-gray-300'
              }
            `}
            onMouseEnter={() => setHoveredId(property.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => handlePropertyClick(property)}
          >
            {property.currency}{property.price_per_night.toLocaleString()}
          </div>
        </OverlayView>
      ))}

      {/* Info Window Popup */}
      {selectedProperty && (
        <InfoWindow
          position={{ lat: selectedProperty.location.latitude, lng: selectedProperty.location.longitude }}
          onCloseClick={handleCloseInfoWindow}
          options={{
            pixelOffset: new window.google.maps.Size(0, -40),
          }}
        >
          <div className="w-72 p-0">
            <div className="relative h-48 w-full">
              <img
                src={selectedProperty.images[0]}
                alt={selectedProperty.title}
                className="w-full h-full object-cover rounded-t-lg"
              />
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">{selectedProperty.property_type}</span>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-gray-900"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-semibold">
                    {selectedProperty.average_rating}
                  </span>
                  <span className="text-xs text-gray-600">
                    ({selectedProperty.total_reviews})
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {selectedProperty.title}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-gray-900">
                  {selectedProperty.currency}{selectedProperty.price_per_night.toLocaleString()}
                </span>
                <span className="text-sm text-gray-600">night</span>
              </div>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}