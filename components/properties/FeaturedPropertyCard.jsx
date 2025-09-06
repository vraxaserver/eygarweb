"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {Heart, Star, Shield, Gift, Ticket, Users, Bed, Bath} from "lucide-react";
import Image from "next/image";


export default function FeaturedPropertyCard({ property, layout = "grid" }) {
    const router = useRouter();
    const [isFavorited, setIsFavorited] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorited(!isFavorited);
    };

    const handleCardClick = () => {
        router.push(`/properties/${property.id}`);
    };

    const nextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    };

    const prevImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex(
            (prev) => (prev - 1 + property.images.length) % property.images.length
        );
    };

    return (
        <Card
            className="group gap-0 cursor-pointer py-0 hover:shadow-lg transition-shadow duration-200 border-border rounded-2xl hover:rounded-2xl"
            onClick={handleCardClick}
        >
            <div className="relative rounded-2xl">
                {/* Property Image */}
                <div className="relative h-64 overflow-hidden rounded-t-2xl">
                    <Image
                        src={property.images[currentImageIndex] || "/placeholder.svg"}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200 rounded-t-2xl"
                    />

                    {/* Image Navigation Dots */}
                    {property.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
                            {property.images.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-colors ${
                                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                                    }`}
                                    onClick={(e) => {
                                        e.preventDefault();
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
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </>
                    )}
                </div>

                {/* Favorite Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full"
                    onClick={handleFavorite}
                >
                    <Heart
                        className={`h-4 w-4 ${
                            isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
                        }`}
                    />
                </Button>

                {/* Safety Badges */}
                {property.safetyBadges && property.safetyBadges.length > 0 && (
                    <div className="absolute top-3 left-3">
                        <Badge
                            variant="secondary"
                            className="bg-primary/90 text-primary-foreground text-xs"
                        >
                            <Shield className="h-3 w-3 mr-1" />
                            {property.safetyBadges.length} Safety Badge
                            {property.safetyBadges.length !== 1 ? "s" : ""}
                        </Badge>
                    </div>
                )}

                {/* Property Title */}
                <h3 className="absolute pl-3 top-40 w-60 bg-white/60 hover:bg-white font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {property.title}
                </h3>
            </div>

            <CardContent className="p-4">
                {/* Special Features */}
                <div className="flex flex-wrap gap-1 mb-3 space-around">
                    {property.experiences && property.experiences.length > 0 && (
                        <Badge
                            variant="outline"
                            className="text-xs border-accent text-accent"
                        >
                            <Gift className="h-3 w-3 mr-1" /> Free Experience <span className="text-purple-300 text-xs font-bold rounded-full">({property.experiences.length})  </span>
                        </Badge>
                    )}
                    {property.coupons && property.coupons.length > 0 && (
                        <Badge
                            variant="outline"
                            className="text-xs border-secondary text-secondary-foreground"
                        >
                            <Ticket className="h-3 w-3 mr-1" />
                            Coupons ({property.coupons.length})
                        </Badge>
                    )}
                </div>

                {/* Property Type and Beds */}
                <div className="flex items-center justify-between mb-2">

                    <div className="flex items-center space-x-3 text-xs text-gray-600 mb-2">
                        <span className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{property.maxGuests} guests</span>
                        </span>
                            <span className="flex items-center space-x-1">
                            <Bed className="h-3 w-3" />
                            <span>{property.beds} bed{property.beds > 1 ? 's' : ''}</span>
                        </span>
                            <span className="flex items-center space-x-1">
                            <Bath className="h-3 w-3" />
                            <span>{property.bathrooms} bath</span>
                        </span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{property.rating}</span>
                    </div>
                </div>

                {/* Host Language */}
                <p className="text-xs text-gray-500 mb-3">🗣️ Host speaks {property.host.languages.join(', ')}</p>

                {/* Price */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-lg font-bold text-gray-900">${property.pricePerNight}</span>
                        <span className="text-sm text-gray-600">/night</span>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-green-600 font-medium">Save</div>
                        <div className="text-xs text-green-600">25% off</div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
