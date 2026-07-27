"use client";

import React, { useState } from 'react';
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { useGoogleMaps } from "@/providers/GoogleMapsProvider";

const mapContainerStyle = {
    width: "100%",
    height: "350px",
    borderRadius: "0.5rem",
};

const DEFAULT_CENTER = { lat: 25.2854, lng: 51.531 }; // Doha default

export default function LocationStep({ formData, handleChange }) {
    const location = formData.location || {};
    const { isLoaded } = useGoogleMaps();
    const [autocomplete, setAutocomplete] = useState(null);

    const currentLat = Number(location.latitude) || DEFAULT_CENTER.lat;
    const currentLng = Number(location.longitude) || DEFAULT_CENTER.lng;

    const handleMarkerDragEnd = (e) => {
        if (!e?.latLng) return;
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        handleChange('latitude', newLat);
        handleChange('longitude', newLng);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Location Details</h2>

            {/* Map Search Box */}
            {isLoaded && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Search Location on Map
                    </label>
                    <Autocomplete
                        onLoad={(instance) => setAutocomplete(instance)}
                        onPlaceChanged={() => {
                            if (autocomplete !== null) {
                                const place = autocomplete.getPlace();
                                if (place?.geometry?.location) {
                                    const lat = place.geometry.location.lat();
                                    const lng = place.geometry.location.lng();
                                    const addressStr = place.formatted_address || place.name || "";
                                    
                                    handleChange('address', location.address || addressStr);
                                    handleChange('latitude', lat);
                                    handleChange('longitude', lng);

                                    place.address_components?.forEach((comp) => {
                                        if (comp.types.includes('locality')) handleChange('city', comp.long_name);
                                        if (comp.types.includes('country')) handleChange('country', comp.long_name);
                                        if (comp.types.includes('administrative_area_level_1')) handleChange('state', comp.long_name);
                                        if (comp.types.includes('postal_code')) handleChange('postal_code', comp.long_name);
                                    });
                                }
                            }
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Type to search location on Google Maps..."
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </Autocomplete>
                </div>
            )}

            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                </label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={location.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Enter Street Address (max 100 chars)"
                    maxLength={100}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                    </label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={location.city || ''}
                        onChange={(e) => handleChange('city', e.target.value)}
                        placeholder="Enter City Name (max 50 chars)"
                        maxLength={50}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State / Province
                    </label>
                    <input
                        type="text"
                        id="state"
                        name="state"
                        value={location.state || ''}
                        onChange={(e) => handleChange('state', e.target.value)}
                        placeholder="Enter State / Province (max 50 chars)"
                        maxLength={50}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                    </label>
                    <input
                        type="text"
                        id="country"
                        name="country"
                        value={location.country || ''}
                        onChange={(e) => handleChange('country', e.target.value)}
                        placeholder="Enter Country Name (max 50 chars)"
                        maxLength={50}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                    </label>
                    <input
                        type="text"
                        id="postal_code"
                        name="postal_code"
                        value={location.postal_code || ''}
                        onChange={(e) => handleChange('postal_code', e.target.value)}
                        placeholder="Enter Postal Code (max 20 chars)"
                        maxLength={20}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
            </div>

            {/* Map Pin Picker Step */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Property Map Pin Location (Drag pin to set exact coordinates)
                </label>
                <div className="border rounded-lg overflow-hidden border-gray-300">
                    {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={{ lat: currentLat, lng: currentLng }}
                            zoom={13}
                            options={{
                                disableDefaultUI: false,
                                zoomControl: true,
                            }}
                        >
                            <Marker
                                position={{ lat: currentLat, lng: currentLng }}
                                draggable={true}
                                onDragEnd={handleMarkerDragEnd}
                                title="Drag pin to set property location"
                            />
                        </GoogleMap>
                    ) : (
                        <div className="h-[350px] bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                            Loading Map...
                        </div>
                    )}
                </div>
                <div className="text-xs text-gray-500 flex justify-between px-1">
                    <span>Selected Pin Coordinates:</span>
                    <span className="font-mono text-indigo-600 font-medium">
                        Lat: {currentLat.toFixed(6)}, Lng: {currentLng.toFixed(6)}
                    </span>
                </div>
            </div>
        </div>
    );
}
