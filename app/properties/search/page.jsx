"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import PropertyCard from "@/components/properties/PropertyCard";
import { useGetPropertiesQuery } from "@/store/features/propertiesApi";
import SearchBar from "@/components/search/SearchBar";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

export default function PropertyListings() {
    // 1. SELECT REDUX STATE
    const reduxSearchState = useSelector((state) => state.search);
    const { filters, location } = reduxSearchState; // Destructure location here

    // 2. COMPONENT STATE for pagination and data aggregation
    const [page, setPage] = useState(1);
    const [allProperties, setAllProperties] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    // Ref to prevent multiple simultaneous fetches during infinite scroll
    const isFetchingRef = useRef(false);

    // 3. MEMOIZE QUERY PARAMS FOR STABLE REFERENCE
    // This is crucial for performance to prevent unnecessary API calls.
    // Added 'location' to the dependencies array to trigger re-memoization when location changes.
    const queryParams = useMemo(() => {
        const params = { page };

        // Location filter from the location part of the search state
        if (location?.name) { // Assuming location.name is the city/country string
            params.location = location.name;
        }

        // Category filter (convert array to comma-separated string)
        if (filters.categories && filters.categories.length > 0) {
            params.categories = filters.categories.join(',');
        }

        // Check-in and check-out dates
        if (filters.checkIn) params.check_in = filters.checkIn;
        if (filters.checkOut) params.check_out = filters.checkOut;

        // Guest calculation
        const totalGuests = (filters.guests?.adults || 0) + (filters.guests?.children || 0);
        if (totalGuests > 0) {
            params.guests = totalGuests;
        }
        
        // Pets
        // Assuming pets are represented by a boolean in filters.guests.pets or similar, adjust if needed
        if (filters.guests?.pets === true) { // Example: if pets filter is a boolean true
            params.pets_allowed = true;
        }

        // Price range
        if (filters.priceRange && filters.priceRange[0] > 0) {
            params.min_price = filters.priceRange[0];
        }
        // Assuming 1000 is a sensible max default; adjust if your scale is different.
        // Make sure max_price is only added if it's set and not at the maximum possible default.
        if (filters.priceRange && filters.priceRange[1] < 1000) {
            params.max_price = filters.priceRange[1];
        }

        // Property & Place type
        if (filters.propertyType) params.property_type = filters.propertyType;
        if (filters.placeType) params.place_type = filters.placeType;

        // Amenities (convert array to comma-separated string)
        if (filters.amenities && filters.amenities.length > 0) {
            params.amenities = filters.amenities.join(',');
        }

        return params;
    }, [page, filters, location]); // Dependency array includes location

    // 4. RTK QUERY DATA FETCHING
    // The query will re-run automatically when queryParams change.
    const { data, isLoading, isFetching, error } = useGetPropertiesQuery(queryParams);
    const properties = data?.items;
    const totalPages = data?.total_pages;

    // 5. EFFECT TO RESET STATE ON FILTER CHANGE
    // When filters or location change, reset page to 1 and clear existing properties.
    useEffect(() => {
        setPage(1);
        setAllProperties([]);
        setHasMore(true);
        isFetchingRef.current = false;
        window.scrollTo(0, 0); // Scroll to top on new search
    }, [filters, location]); // Depend on filters and location

    // 6. EFFECT TO AGGREGATE PROPERTIES FOR INFINITE SCROLL
    useEffect(() => {
        if (properties && properties.length > 0) {
            // Append new properties, avoiding duplicates that might occur on refetches
            setAllProperties(prev => {
                const existingIds = new Set(prev.map(p => p.id));
                const newProperties = properties.filter(p => !existingIds.has(p.id));
                return [...prev, ...newProperties];
            });
            setHasMore(page < totalPages);
        } else if (!isLoading && !isFetching) {
            // If no properties are returned and we're not currently loading, assume there are no more pages.
            // This also covers the case where a search yields zero results.
            setHasMore(false);
            setAllProperties([]); // Ensure properties are cleared if no results
        }
        isFetchingRef.current = false; // Allow fetching again after data processing
    }, [properties, page, totalPages, isLoading, isFetching]);

    // 7. EFFECT FOR INFINITE SCROLL LOGIC
    useEffect(() => {
        const handleScroll = () => {
            // Prevent fetching if already fetching, no more data, or initial load is happening.
            if (isFetchingRef.current || !hasMore || isLoading || isFetching) return;

            // Check if the user has scrolled near the bottom of the page.
            // The condition `window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200`
            // means we trigger loading when the user is within 200px of the bottom.
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200) {
                isFetchingRef.current = true; // Set flag to prevent multiple calls
                setPage(prev => prev + 1);    // Increment page number to trigger fetch
            }
        };

        window.addEventListener("scroll", handleScroll);
        // Cleanup the event listener on component unmount
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, isLoading, isFetching]); // Dependencies ensure the effect re-runs if these states change


    // --- UI RENDERING ---

    const renderSkeletons = () => (
        Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" /> {/* Adjusted width for full space */}
                    <Skeleton className="h-4 w-3/4" /> {/* Adjusted width for better visual */}
                </div>
            </div>
        ))
    );

    return (
        <div>
            <SearchBar />

            {/* Main content area */}
            {/* Adjusted max-width and added padding for a cleaner look */}
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error ? (
                    <div className="text-center text-red-500">
                        Failed to load properties. Please try again.
                    </div>
                ) : (
                    <>
                        {/* Initial Loading State (Page 1) */}
                        {page === 1 && isLoading && (
                            // Using xl:grid-cols-4 for 4 columns on large screens.
                            // If you want 7 properties, you'd need custom CSS or a different layout.
                            // This setup provides 1, 2, 3, 4 columns responsively.
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                                {renderSkeletons()}
                            </div>
                        )}

                        {/* No Results Found State */}
                        {!isLoading && allProperties.length === 0 && (
                            <div className="text-center py-20">
                                <h2 className="text-2xl font-semibold mb-2">No properties found</h2>
                                <p className="text-gray-500">
                                    Try adjusting your search filters or location.
                                </p>
                            </div>
                        )}
                        
                        {/* Display Properties */}
                        {allProperties.length > 0 && (
                            // Grid layout: 1 col (xs), 2 (sm), 3 (md), 4 (lg & xl)
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                                {allProperties.map((property) => (
                                    <PropertyCard key={property.id} property={property} />
                                ))}
                            </div>
                        )}

                        {/* Subsequent Loading (Infinite Scroll Indicator) */}
                        {/* Show skeletons only if actively fetching more pages */}
                        {isFetching && page > 1 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 mt-6">
                                {renderSkeletons()}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
