"use client";

import { useJsApiLoader } from "@react-google-maps/api";

// Combine all libraries you need here
const libraries = ["places", "maps"];

export const GoogleMapsProvider = ({ children }) => {
    const { isLoaded, loadError } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading...</div>; // Or a spinner component
    }

    return children;
};