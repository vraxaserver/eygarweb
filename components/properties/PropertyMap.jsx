// components/PropertyMap.jsx
"use client";

import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
    useCallback,
} from "react";
import { GoogleMap, OverlayView, InfoWindow } from "@react-google-maps/api";
import { useGoogleMaps } from "@/providers/GoogleMapsProvider";
import Link from "next/link";

const mapContainerStyle = {
    width: "100%",
    height: "100vh",
};

// Doha fallback (only used if properties is empty or first item has invalid coords)
const DOHA_FALLBACK_CENTER = { lat: 25.2854, lng: 51.531 };

export default function PropertyMap({ properties = [] }) {
    const { isLoaded } = useGoogleMaps();

    const [hoveredId, setHoveredId] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);

    const mapRef = useRef(null);

    // Format price nicely (compact + readable)
    const formatPrice = useCallback((p) => {
        const val = Number(p?.price_per_night);
        if (!Number.isFinite(val))
            return `${p?.currency || ""} ${p?.price_per_night ?? ""}`.trim();

        // e.g. 1200 -> 1,200
        return `${p?.currency || ""} ${val.toLocaleString()}`.trim();
    }, []);

    // 1) Default center = first property location (if valid), otherwise Doha fallback
    const defaultCenter = useMemo(() => {
        if (!properties || properties.length === 0) return DOHA_FALLBACK_CENTER;

        const lat = Number(properties[0]?.location?.latitude);
        const lng = Number(properties[0]?.location?.longitude);

        const valid =
            Number.isFinite(lat) &&
            Number.isFinite(lng) &&
            Math.abs(lat) <= 90 &&
            Math.abs(lng) <= 180;

        return valid ? { lat, lng } : DOHA_FALLBACK_CENTER;
    }, [properties]);

    // 2) Filter and normalize coords for all properties
    const propertiesWithCoords = useMemo(() => {
        return (properties || [])
            .map((p) => {
                const lat = Number(p?.location?.latitude);
                const lng = Number(p?.location?.longitude);

                const valid =
                    Number.isFinite(lat) &&
                    Number.isFinite(lng) &&
                    Math.abs(lat) <= 90 &&
                    Math.abs(lng) <= 180;

                return valid ? { ...p, __lat: lat, __lng: lng } : null;
            })
            .filter(Boolean);
    }, [properties]);

    // 3) Fit bounds to show all markers; if none, center to defaultCenter
    const fitToBounds = useCallback(() => {
        if (!mapRef.current) return;
        if (!isLoaded) return;

        if (!propertiesWithCoords || propertiesWithCoords.length === 0) {
            mapRef.current.setCenter(defaultCenter);
            mapRef.current.setZoom(12);
            return;
        }

        const bounds = new window.google.maps.LatLngBounds();
        propertiesWithCoords.forEach((p) =>
            bounds.extend({ lat: p.__lat, lng: p.__lng })
        );

        mapRef.current.fitBounds(bounds);

        // If only one marker, avoid overly aggressive zoom
        if (propertiesWithCoords.length === 1) {
            window.setTimeout(() => {
                if (!mapRef.current) return;
                const z = mapRef.current.getZoom() ?? 12;
                mapRef.current.setZoom(Math.min(z, 15));
            }, 0);
        }
    }, [isLoaded, propertiesWithCoords, defaultCenter]);

    useEffect(() => {
        if (!isLoaded) return;
        fitToBounds();
    }, [isLoaded, fitToBounds]);

    const handlePropertyClick = (property) => setSelectedProperty(property);
    const handleCloseInfoWindow = () => setSelectedProperty(null);

    const selectedLatLng = useMemo(() => {
        if (!selectedProperty?.location) return null;
        const lat = Number(selectedProperty.location.latitude);
        const lng = Number(selectedProperty.location.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return { lat, lng };
    }, [selectedProperty]);

    const getFirstImageUrl = (p) => {
        const first = p?.images?.[0];
        if (!first) return "";

        if (typeof first === "string") return first;
        if (typeof first === "object" && first.image_url)
            return String(first.image_url);
        if (typeof first === "object" && first.url) return String(first.url);

        return "";
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
                clickableIcons: false,
            }}
            onLoad={(map) => {
                mapRef.current = map;
                fitToBounds();
            }}
            onUnmount={() => {
                mapRef.current = null;
            }}
            onClick={handleCloseInfoWindow}
        >
            {propertiesWithCoords.map((property) => {
                const isActive =
                    hoveredId === property.id ||
                    selectedProperty?.id === property.id;

                return (
                    <OverlayView
                        key={property.id}
                        position={{ lat: property.__lat, lng: property.__lng }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        // zIndex helps active marker stay on top of others
                        zIndex={isActive ? 999 : 1}
                    >
                        <button
                            type="button"
                            className={[
                                // Capsule / hyperbola horizontal pill
                                "inline-flex items-center justify-center",
                                "whitespace-nowrap select-none",
                                "rounded-full",
                                // Small readable typography
                                "text-[12px] leading-none font-semibold",
                                // Comfortable horizontal fit
                                "px-3 py-1.5",
                                // Border + shadow for map readability
                                "border shadow-sm",
                                // Smooth interactions
                                "transition-transform duration-150 ease-out",
                                "hover:shadow-md hover:-translate-y-[1px]",
                                "active:translate-y-0",
                                isActive
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "bg-white text-gray-900 border-gray-300",
                            ].join(" ")}
                            onMouseEnter={() => setHoveredId(property.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePropertyClick(property);
                            }}
                            aria-label={`View ${
                                property.title || "property"
                            } on map`}
                        >
                            {/* Price text */}
                            {formatPrice(property)}
                        </button>
                    </OverlayView>
                );
            })}

            {selectedProperty && selectedLatLng && (
                <InfoWindow
                    position={selectedLatLng}
                    onCloseClick={handleCloseInfoWindow}
                    options={{
                        pixelOffset: new window.google.maps.Size(0, -44),
                    }}
                >
                    <div className="w-72 p-0">
                        <div className="relative h-48 w-full">
                            <img
                                src={getFirstImageUrl(selectedProperty)}
                                alt={selectedProperty.title}
                                className="w-full h-full object-cover rounded-t-lg"
                            />
                        </div>

                        <div className="p-3">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-600">
                                    {selectedProperty.property_type ||
                                        "Property"}
                                </span>

                                <div className="flex items-center gap-1">
                                    <svg
                                        className="w-4 h-4 text-gray-900"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>

                                    <span className="text-sm font-semibold">
                                        {selectedProperty.average_rating ?? "—"}
                                    </span>

                                    <span className="text-xs text-gray-600">
                                        ({selectedProperty.total_reviews ?? 0})
                                    </span>
                                </div>
                            </div>

                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                <Link
                                    href={`/properties/${selectedProperty.id}`}
                                >
                                    {selectedProperty.title}
                                </Link>
                            </h3>

                            <div className="flex items-baseline gap-1">
                                <span className="text-lg font-bold text-gray-900">
                                    {formatPrice(selectedProperty)}
                                </span>
                                <span className="text-sm text-gray-600">
                                    night
                                </span>
                            </div>
                        </div>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
}
