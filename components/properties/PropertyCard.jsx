"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react"; // Replaced SVG with Lucide icons
import Image from "next/image";

export default function PropertyCard({ property }) {
    const router = useRouter();
    // Initialize the favorited state from the property prop
    const [isFavorited, setIsFavorited] = useState(property.isLiked || false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // This handler will now correctly be called when the card is clicked
    const handleCardClick = () => {
        router.push(`/properties/${property.id}`);
    };
    
    // Toggles the favorite state locally for immediate UI feedback
    const handleFavorite = (e) => {
        e.stopPropagation(); // Prevent card click event from firing
        setIsFavorited(!isFavorited);
        // In a real app, you would also call an API to update the backend here
    };

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex(
            (prev) => (prev - 1 + property.images.length) % property.images.length
        );
    };

    // Helper to format the location object into a readable string
    const locationString = property.location
        ? `${property.location.city}, ${property.location.country}`
        : "Location not available";

    return (
        <Card
            onClick={handleCardClick}
            className="group cursor-pointer py-0 rounded-2xl overflow-hidden border-transparent hover:shadow-xl transition-shadow duration-300 bg-white"
        >
            <CardContent className="p-0">
                <div className="relative">
                    {/* Property Image Carousel */}
                    <div className="relative h-72 w-full">
                        <Image
                            src={property.images[currentImageIndex] || "/placeholder.svg"}
                            alt={property.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>

                    {/* Image Navigation Dots */}
                    {property.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                            {property.images.map((_, index) => (
                                <button
                                    key={index}
                                    aria-label={`Go to image ${index + 1}`}
                                    className={`block w-2 h-2 rounded-full transition-colors ${
                                        index === currentImageIndex ? "bg-white" : "bg-white/60"
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIndex(index);
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Navigation Arrows */}
                    {property.images.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                aria-label="Previous image"
                                onClick={prevImage}
                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                aria-label="Next image"
                                onClick={nextImage}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </>
                    )}

                    {/* Favorite Button */}
                     <Button
                        variant="ghost"
                        size="sm"
                        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                        onClick={handleFavorite}
                        className="absolute top-3 right-3 h-8 w-8 rounded-full p-0 bg-black/30 hover:bg-black/50 text-white hover:scale-110 transition-transform"
                    >
                        <Heart className={`h-5 w-5 transition-colors ${isFavorited ? "fill-red-500 text-red-500" : "fill-transparent"}`} />
                    </Button>

                    {/* Type & Beds Badge */}
                    <div className="absolute bottom-3 left-3">
                        <Badge variant="secondary" className="bg-white/90 text-black shadow">
                            {property.type} • {property.beds} bed{property.beds !== 1 ? "s" : ""}
                        </Badge>
                    </div>
                </div>

                {/* Card Information */}
                <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-800 truncate pr-2">{property.title}</h3>
                        <div className="flex items-center space-x-1 flex-shrink-0">
                            <Star className="w-4 h-4 text-gray-800" />
                            <span className="text-sm font-medium text-gray-800">{property.rating}</span>
                        </div>
                    </div>

                    {/* THE FIX: Render the formatted location string instead of the object */}
                    <p className="text-gray-500 text-sm mb-2">{locationString}</p>
                    
                    <div className="flex items-baseline space-x-1">
                        <span className="font-bold text-lg text-gray-900">${property.pricePerNight}</span>
                        <span className="text-gray-600 text-sm">/ night</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}