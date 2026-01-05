"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";

import SearchBar from "@/components/search/SearchBar";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyMap from "@/components/properties/PropertyMap";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetPropertiesQuery } from "@/store/features/propertiesApi";

export default function PropertyListings() {
    const searchParams = useSearchParams();

    // Build stable params object from URL
    const paramsObject = useMemo(() => {
        return Object.fromEntries(searchParams.entries());
    }, [searchParams]);

    // Pagination + aggregated items for infinite scroll
    const [page, setPage] = useState(1);
    const [allProperties, setAllProperties] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    // Prevent multiple triggers
    const isFetchingRef = useRef(false);

    // IMPORTANT: include page in query args
    const queryArgs = useMemo(() => {
        return {
            ...paramsObject,
            page, // your backend must support this
        };
    }, [paramsObject, page]);

    const { data, isLoading, isFetching, error } =
        useGetPropertiesQuery(queryArgs);

    const properties = data?.items || [];
    const totalPages = data?.total_pages || 1;
    const totalItems = data?.total_items || data?.count || allProperties.length;

    // Reset when filters/location (URL params) change
    useEffect(() => {
        setPage(1);
        setAllProperties([]);
        setHasMore(true);
        isFetchingRef.current = false;
    }, [paramsObject]);

    // Aggregate properties (avoid duplicates)
    useEffect(() => {
        if (properties && properties.length > 0) {
            setAllProperties((prev) => {
                // If this is page 1 after params changed, replace instead of append
                if (page === 1) return properties;

                const existingIds = new Set(prev.map((p) => p.id));
                const newOnes = properties.filter(
                    (p) => !existingIds.has(p.id)
                );
                return [...prev, ...newOnes];
            });

            setHasMore(page < totalPages);
        } else if (!isLoading && !isFetching) {
            // No results returned
            if (page === 1) setAllProperties([]);
            setHasMore(false);
        }

        isFetchingRef.current = false;
    }, [properties, page, totalPages, isLoading, isFetching]);

    // Infinite scroll (window scroll)
    const handleScroll = useCallback(() => {
        if (isFetchingRef.current || !hasMore || isLoading || isFetching)
            return;

        const scrollTop = document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        const fullHeight = document.documentElement.offsetHeight;

        if (viewportHeight + scrollTop >= fullHeight - 250) {
            isFetchingRef.current = true;
            setPage((prev) => prev + 1);
        }
    }, [hasMore, isLoading, isFetching]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    const renderSkeletons = () =>
        Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>
        ));

    return (
        <div>
            <SearchBar />

            {/* Full-width layout similar to Airbnb: left list + right sticky map */}
            <div className="w-full">
                <div className="flex w-full">
                    {/* LEFT: Results */}
                    <div className="w-full lg:w-[58%] xl:w-[55%]">
                        <div className="px-4 sm:px-6 lg:px-8 py-6">
                            {error ? (
                                <div className="text-center text-red-500">
                                    Failed to load properties. Please try again.
                                </div>
                            ) : (
                                <>
                                    {/* Top meta row (like "643 homes") */}
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600">
                                            {isLoading && page === 1
                                                ? "Loading results..."
                                                : `${totalItems} homes`}
                                        </p>
                                    </div>

                                    {/* Initial loading */}
                                    {page === 1 && isLoading && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                            {renderSkeletons()}
                                        </div>
                                    )}

                                    {/* No results */}
                                    {!isLoading &&
                                        allProperties.length === 0 && (
                                            <div className="text-center py-20">
                                                <h2 className="text-2xl font-semibold mb-2">
                                                    No properties found
                                                </h2>
                                                <p className="text-gray-500">
                                                    Try adjusting your search
                                                    filters or location.
                                                </p>
                                            </div>
                                        )}

                                    {/* Results grid */}
                                    {allProperties.length > 0 && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                            {allProperties.map((property) => (
                                                <PropertyCard
                                                    key={property.id}
                                                    property={property}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Fetching next pages */}
                                    {isFetching && page > 1 && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-6">
                                            {renderSkeletons()}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Sticky Map (hidden on small screens, like Airbnb) */}
                    <div className="hidden lg:block lg:w-[42%] xl:w-[45%]">
                        <div className="sticky top-0 h-screen">
                            <PropertyMap properties={allProperties} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
