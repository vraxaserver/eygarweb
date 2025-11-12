"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Map } from "lucide-react";

import PropertyCard from "@/components/properties/PropertyCard";
import { useGetPropertiesQuery } from "@/store/features/propertiesApi";
import SearchBar from "@/components/search/SearchBar";
import Image from "next/image";
import { selectCurrentUser } from "@/store/slices/authSlice";
import PropertyMap from "@/components/properties/PropertyMap";
import Link from "next/link";

export default function PropertyListings() {
    const user = useSelector(selectCurrentUser);
    const reduxSearch = useSelector((state) => state.search);
    const reduxFilters = useSelector((state) => state.search.filters);
    const reduxSearchQuery = useSelector((state) => state.search.searchQuery);

    const [viewMode, setViewMode] = useState("grid");
    const [category, setCategory] = useState("");
    const [page, setPage] = useState(1);
    const [allProperties, setAllProperties] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const isFetchingRef = useRef(false);

    const currentUserId = user?.eygar_host?.id;

    // Build query params from Redux state
    const buildQueryParams = () => {
        const params = {
            page,
        };

        // Add search query
        if (reduxSearchQuery) {
            params.search = reduxSearchQuery;
        }

        // Add category
        if (category && category !== "All") {
            params.category = category;
        } else if (reduxFilters.category) {
            params.category = reduxFilters.category;
        }

        // Add check-in and check-out dates
        if (reduxFilters.checkIn) {
            params.check_in = reduxFilters.checkIn;
        }
        if (reduxFilters.checkOut) {
            params.check_out = reduxFilters.checkOut;
        }

        // Add guests
        if (reduxFilters.guests) {
            const totalGuests =
                (reduxFilters.guests.adults || 0) +
                (reduxFilters.guests.children || 0);
            if (totalGuests > 0) {
                params.guests = totalGuests;
            }
            if (reduxFilters.guests.adults > 0) {
                params.adults = reduxFilters.guests.adults;
            }
            if (reduxFilters.guests.children > 0) {
                params.children = reduxFilters.guests.children;
            }
        }

        // Add price range
        if (
            reduxFilters.min_price !== undefined &&
            reduxFilters.min_price > 0
        ) {
            params.min_price = reduxFilters.min_price;
        }
        if (
            reduxFilters.max_price !== undefined &&
            reduxFilters.max_price < 1000
        ) {
            params.max_price = reduxFilters.max_price;
        }

        // Add property type
        if (reduxFilters.propertyType) {
            params.property_types = reduxFilters.propertyType;
        }

        // Add amenities
        if (reduxFilters.amenities && reduxFilters.amenities.length > 0) {
            params.amenities = reduxFilters.amenities.join(",");
        }

        // Add experiences
        if (reduxFilters.has_experiences) {
            params.has_experiences = reduxFilters.has_experiences;
        }

        if (reduxSearch.location?.city) {
            params.location = reduxSearch.location?.city;
            params.country = reduxSearch.location?.country;
        }

        return params;
    };

    const queryParams = buildQueryParams();

    const {
        data: properties,
        isLoading,
        error,
        isFetching,
    } = useGetPropertiesQuery(queryParams);

    // Reset pagination when filters or category change
    useEffect(() => {
        setPage(1);
        setAllProperties([]);
        setHasMore(true);
        isFetchingRef.current = false;
    }, [reduxFilters, reduxSearchQuery, category]);

    // Update allProperties when new data is fetched
    useEffect(() => {
        if (properties && properties.items) {
            if (page === 1) {
                // Reset properties on first page
                setAllProperties(properties.items);
            } else {
                // Append new properties, avoiding duplicates
                setAllProperties((prev) => {
                    const existingIds = new Set(prev.map((p) => p.id));
                    const newProperties = properties.items.filter(
                        (p) => !existingIds.has(p.id)
                    );
                    return [...prev, ...newProperties];
                });
            }

            // Check if there are more pages
            setHasMore(page < properties.total_pages);
            isFetchingRef.current = false;
        }
        
    }, [properties, page]);

    // Infinite scroll handler
    useEffect(() => {
        const handleScroll = () => {
            // Check if already loading or no more data
            if (isFetchingRef.current || !hasMore || isLoading || isFetching)
                return;

            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = document.documentElement.scrollTop;
            const clientHeight = document.documentElement.clientHeight;

            // Calculate scroll percentage
            const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

            // Load more when user reaches 80% of the page
            if (scrollPercentage >= 0.8) {
                isFetchingRef.current = true;
                setPage((prev) => prev + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, isLoading, isFetching]);

    return (
        <div>
            <SearchBar />
            {/* View Mode Switcher */}
            {/* MODIFICATION: Added `hidden md:flex` to hide the switcher on mobile */}
            <div className="border hidden md:flex justify-end pr-4 sm:pr-6 lg:pr-8 py-4 bg-white-100">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                    <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        onClick={() => setViewMode("grid")}
                        className={`rounded-r-none ${
                            viewMode === "grid"
                                ? "bg-[#814193] hover:bg-[#6d3580] text-white"
                                : "text-gray-700 border-gray-300"
                        }`}
                    >
                        Grid
                    </Button>

                    <Button
                        variant={viewMode === "map" ? "default" : "outline"}
                        onClick={() => setViewMode("map")}
                        className={`rounded-l-none ${
                            viewMode === "map"
                                ? "bg-[#814193] hover:bg-[#6d3580] text-white"
                                : "text-gray-700 border-gray-300"
                        }`}
                    >
                        <Map className="w-4 h-4 mr-2" /> Map
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-8">
                {page === 1 && isLoading && (
                    <div className="center">Loading..</div>
                )}
                {/* 
                  MODIFICATION: Since the switcher is hidden on mobile, we can simplify this logic. 
                  On small screens, it will always be grid view. On larger screens, it respects the viewMode state.
                */}
                <div className="block md:hidden"> {/* Mobile view: Always grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                        {allProperties.map((property) => (
                            <PropertyCard
                                className="py-0"
                                key={property.id}
                                property={property}
                                currentUserId={currentUserId}
                            />
                        ))}
                    </div>
                </div>

                <div className="hidden md:block"> {/* Desktop view: Respects viewMode */}
                    {viewMode === "grid" && (
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                            {allProperties.map((property) => (
                                <PropertyCard
                                    className="py-0"
                                    key={property.id}
                                    property={property}
                                    currentUserId={currentUserId}
                                />
                            ))}
                        </div>
                    )}

                    {viewMode === "map" && allProperties.length > 0 && (
                        <div className="space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="">
                                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                                        {allProperties.map((property) => (
                                            <PropertyCard
                                                className="py-0"
                                                key={property.id}
                                                property={property}
                                                currentUserId={currentUserId}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="">
                                    {allProperties &&
                                    <PropertyMap properties={allProperties} />
                                    }
                                    
                                </div>
                            </div>
                            
                        </div>
                    )}
                </div>

                {/* Loading indicator for subsequent pages */}
                {page > 1 && (isLoading || isFetching) && (
                    <div className="text-center py-8">
                        <p className="text-gray-600">
                            Loading more properties...
                        </p>
                    </div>
                )}

                {/* End of data indicator */}
                {!hasMore && allProperties.length > 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-600">
                            No more properties to load
                        </p>
                    </div>
                )}

                {/* No results message */}
                {!isLoading && allProperties.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-600">
                            No properties found matching your criteria
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
