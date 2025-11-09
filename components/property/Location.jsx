'use client';

import { Gift, MapPin, ExternalLink } from 'lucide-react';

export default function Location({ location }) {
  if (!location) return null;

  const { address, city, country, latitude, longitude } = location;

  const hasCoords =
    typeof latitude === 'number' && typeof longitude === 'number';

  const mapsQuery = hasCoords
    ? `${latitude},${longitude}`
    : encodeURIComponent(`${address ?? ''} ${city ?? ''} ${country ?? ''}`);

  const mapsEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    mapsQuery
  )}&z=15&output=embed`;

  const mapsOpenUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapsQuery
  )}`;

  return (
    <section id="location" className="mb-10">
      <h3 className="flex items-center gap-3 text-lg font-semibold py-5">
        <Gift className="h-7 w-7 text-amber-600 flex-shrink-0" />
        <span>Where you'll be</span>
      </h3>

      {/* Address Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 rounded-t-lg px-4 py-3 border border-gray-200">
        <div className="flex items-start gap-2 text-gray-800">
          <MapPin className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium">
              {[address, city, country].filter(Boolean).join(', ')}
            </p>
          </div>
        </div>

        <a
          href={mapsOpenUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-primary hover:underline mt-2 sm:mt-0"
        >
          View on Google Maps
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {/* Map Section */}
      <div className="w-full h-64 sm:h-80 md:h-96 border border-gray-200 border-t-0 rounded-b-lg overflow-hidden bg-gray-200">
        {hasCoords ? (
          <iframe
            title="Property location map"
            src={mapsEmbedSrc}
            width="100%"
            height="100%"
            loading="lazy"
            className="w-full h-full border-0"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Map unavailable</p>
          </div>
        )}
      </div>
    </section>
  );
}
