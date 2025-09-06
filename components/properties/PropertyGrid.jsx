"use client";


import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "./PropertyCard";

export default function PropertyGrid({ properties, loading }) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-muted rounded-lg h-64 mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-4 bg-muted rounded w-1/2"></div>
                            <div className="h-4 bg-muted rounded w-1/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with results count and map toggle */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h2 className="text-lg font-semibold text-foreground">
                        {properties.length} stays found
                    </h2>
                    <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>Monthly Special Offers</span>
                        <Button variant="ghost" size="sm" className="text-xs">
                            ✕
                        </Button>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="hidden md:block text-sm text-muted-foreground">
                        EYGAR Added Values ↗
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2 bg-transparent"
                    >
                        <MapPin className="h-4 w-4" />
                        <span>Show map</span>
                    </Button>
                </div>
            </div>

            {/* Property Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>

            {/* Load More */}
            {properties.length > 0 && (
                <div className="flex justify-center mt-8">
                    <Button variant="outline" size="lg">
                        Show more properties
                    </Button>
                </div>
            )}
        </div>
    );
}
