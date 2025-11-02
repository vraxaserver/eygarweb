"use client";

import { Autocomplete } from "@react-google-maps/api";
import { useCallback, useRef } from "react";

export const PlacesAutocomplete = ({ onPlaceSelect }) => {
    const autocompleteRef = useRef(null);

    const onLoad = useCallback((autocomplete) => {
        autocompleteRef.current = autocomplete;
    }, []);

    const onPlaceChanged = () => {
        if (autocompleteRef.current !== null) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry) {
                onPlaceSelect({
                    name: place.formatted_address,
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                });
            }
        }
    };

    return (
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input
                type="text"
                placeholder="Search for a location"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </Autocomplete>
    );
};