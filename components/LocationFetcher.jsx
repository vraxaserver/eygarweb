"use client"

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchLocationStart, 
    fetchLocationSuccess, 
    fetchLocationFailure, 
    selectLocation 
} from '@/store/slices/locationSlice';

// Access the public environment variable for the API Key
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const LocationFetcher = () => {
    const dispatch = useDispatch();
    const { status } = useSelector(selectLocation);

    // Function to call the Google Geocoding API with a specified language
    const reverseGeocode = async (latitude, longitude, language) => {
        if (!GOOGLE_MAPS_API_KEY) {
            console.error("Google Maps API Key is missing. Check NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.");
            return { cityName: 'Unknown', formattedAddress: `API Key Missing (${language})` };
        }

        // Use the 'language' parameter in the API call
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}&language=${language}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.status === 'OK' && data.results.length > 0) {
                const firstResult = data.results[0];
                const formattedAddress = firstResult.formatted_address;
                let cityName = 'Unknown City';

                // Look for 'locality', 'postal_town', or 'administrative_area_level_2' for a city name
                const cityComponent = firstResult.address_components.find(component => 
                    component.types.includes('locality') || 
                    component.types.includes('postal_town') ||
                    component.types.includes('administrative_area_level_2')
                );

                if (cityComponent) {
                    cityName = cityComponent.long_name;
                } else {
                    // Fallback to the largest administrative area if locality is missing
                    const adminArea = firstResult.address_components.find(component => 
                        component.types.includes('administrative_area_level_1')
                    );
                    if (adminArea) {
                        cityName = adminArea.long_name;
                    }
                }

                return { cityName, formattedAddress };
            } else {
                return { cityName: `Location not found (${language})`, formattedAddress: `Reverse Geocoding failed (${language})` };
            }
        } catch (error) {
            console.error(`Reverse Geocoding API error for language ${language}:`, error);
            return { cityName: 'API Error', formattedAddress: `Reverse Geocoding network error (${language})` };
        }
    };


    useEffect(() => {
        // Stop if location is already successfully fetched or currently fetching
        if (status === 'success' || status === 'loading') {
            return;
        }

        // Check if the browser supports the Geolocation API
        if (!('geolocation' in navigator)) {
            dispatch(fetchLocationFailure('Geolocation is not supported by this browser.'));
            return;
        }

        // Dispatch loading state for the *entire* process (coordinates + names)
        dispatch(fetchLocationStart());

        // Get the coordinates
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // 1. Get location data in the local language (using 'ar' to ensure Arabic based on your example)
                const localResult = await reverseGeocode(latitude, longitude, 'ar');
                
                // 2. Get location data in English
                const englishResult = await reverseGeocode(latitude, longitude, 'en');

                // Dispatch final success action with all data
                dispatch(fetchLocationSuccess({ 
                    latitude, 
                    longitude, 
                    cityName: localResult.cityName,
                    formattedAddress: localResult.formattedAddress,
                    cityNameEn: englishResult.cityName,
                    formattedAddressEn: englishResult.formattedAddress,
                }));
            },
            (error) => {
                let errorMessage;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "User denied the request for Geolocation.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "The request to get user location timed out.";
                        break;
                    case error.UNKNOWN_ERROR:
                    default:
                        errorMessage = "An unknown error occurred.";
                        break;
                }
                // Dispatch failure action
                dispatch(fetchLocationFailure(errorMessage));
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    }, [dispatch, status]); 

    return null; 
};

export default LocationFetcher;
