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
import { selectLocation } from "@/store/slices/locationSlice";


export default function PropertyListings() {
    const user = useSelector(selectCurrentUser);
    const loc = useSelector(selectLocation);
    console.log("============Location=============")
    console.log(loc)
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
            const totalGuests = (reduxFilters.guests.adults || 0) + (reduxFilters.guests.children || 0);
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
        if (reduxFilters.min_price !== undefined && reduxFilters.min_price > 0) {
            params.min_price = reduxFilters.min_price;
        }
        if (reduxFilters.max_price !== undefined && reduxFilters.max_price < 1000) {
            params.max_price = reduxFilters.max_price;
        }

        // Add property type
        if (reduxFilters.propertyType) {
            params.property_types = reduxFilters.propertyType;
        }

        // Add amenities
        if (reduxFilters.amenities && reduxFilters.amenities.length > 0) {
            params.amenities = reduxFilters.amenities.join(',');
        }

        // Add experiences
        if (reduxFilters.has_experiences) {
            params.has_experiences = reduxFilters.has_experiences;
        }

        return params;
    };

    const queryParams = buildQueryParams();
    console.log("==============queryParams==============")
    console.log(queryParams)

    const { data: properties, isLoading, error, isFetching } = useGetPropertiesQuery(queryParams);

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
                setAllProperties(prev => {
                    const existingIds = new Set(prev.map(p => p.id));
                    const newProperties = properties.items.filter(
                        p => !existingIds.has(p.id)
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
            if (isFetchingRef.current || !hasMore || isLoading || isFetching) return;

            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = document.documentElement.scrollTop;
            const clientHeight = document.documentElement.clientHeight;

            // Calculate scroll percentage
            const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

            // Load more when user reaches 80% of the page
            if (scrollPercentage >= 0.8) {
                isFetchingRef.current = true;
                setPage(prev => prev + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, isLoading, isFetching]);

    return (
        <div>
            <SearchBar />
            {/* Categories */}
            <div className="border-b border-gray-200 pt-5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    No data
                </div>
            </div>

            
        </div>
    );
}
