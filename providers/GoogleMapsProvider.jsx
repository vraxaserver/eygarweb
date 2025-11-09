"use client";
import React, { createContext, useContext } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const GoogleMapsContext = createContext({ isLoaded: false });

export const GoogleMapsProvider = ({ children }) => {
    const { isLoaded, loadError } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: ["places", "maps"], // keep this consistent app-wide
        version: "weekly",
    });

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading...</div>; // Or a spinner component
    }

    return (
        <GoogleMapsContext.Provider value={{ isLoaded }}>
            {children}
        </GoogleMapsContext.Provider>
    );
};

export function useGoogleMaps() {
    return useContext(GoogleMapsContext);
}
