"use client";

import React, { useState } from "react"; // Added useState
import {
    ArrowLeft,
    MapPin,
    Star,
    Calendar,
    Users,
    Wifi,
    Car,
    Coffee,
    Home,
    Mail,
    ChevronLeft, // Added for slider
    ChevronRight, // Added for slider
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PropertyRules } from "@/components/dashboard/guests/PropertyRules";
import { ExperienceCard } from "@/components/dashboard/guests/ExperienceCard";
import { CouponCard } from "@/components/dashboard/guests/CouponCard";
import { formatCurrency } from "@/lib/utils";

export function BookingDetail({ booking, onBack }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Slider state

    if (!booking) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const property = booking.property_snapshot || {};
    const location = property.location || {};
    const images = property.images || [];

    // Slider handlers
    const nextSlide = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    const prevSlide = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    return (
        <div className="w-full bg-white">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onBack}
                                className="flex items-center space-x-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>Back</span>
                            </Button>
                            <div className="h-6 w-px bg-gray-300" />
                            <h1 className="text-xl font-semibold text-gray-900">
                                Booking Details
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                    {/* Image Slider Area */}
                    <div className="lg:col-span-7 relative h-[300px] md:h-[450px] group overflow-hidden rounded-xl shadow-sm bg-gray-100">
                        {images.length > 0 ? (
                            <>
                                <div className="w-full h-full relative">
                                    {images.map((img, idx) => (
                                        <div
                                            key={img.id || idx}
                                            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                                                idx === currentImageIndex
                                                    ? "opacity-100 z-10"
                                                    : "opacity-0 z-0"
                                            }`}
                                        >
                                            <img
                                                src={img.image_url}
                                                alt={`${property.title} - ${
                                                    idx + 1
                                                }`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Controls */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevSlide}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <ChevronLeft className="h-5 w-5 text-gray-800" />
                                        </button>
                                        <button
                                            onClick={nextSlide}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <ChevronRight className="h-5 w-5 text-gray-800" />
                                        </button>

                                        {/* Indicators */}
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                                            {images.map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`h-1.5 rounded-full transition-all ${
                                                        idx ===
                                                        currentImageIndex
                                                            ? "w-6 bg-white"
                                                            : "w-1.5 bg-white/50"
                                                    }`}
                                                />
                                            ))}
                                        </div>

                                        {/* Counter */}
                                        <div className="absolute top-4 right-4 z-20 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                                            {currentImageIndex + 1} /{" "}
                                            {images.length}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <Home className="h-12 w-12 text-gray-300" />
                            </div>
                        )}
                    </div>

                    {/* Quick Info */}
                    <div className="lg:col-span-5 space-y-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                                {property.title}
                            </h2>
                            <div className="flex items-center text-gray-600 text-lg mb-3">
                                <MapPin className="h-5 w-5 mr-2 text-primary" />
                                {location.city}, {location.country}
                            </div>
                            <div className="flex items-center mb-4">
                                <Star className="h-5 w-5 text-yellow-400 mr-1 fill-current" />
                                <span className="font-bold text-lg">
                                    {property.average_rating > 0
                                        ? property.average_rating
                                        : "New"}
                                </span>
                                <span className="text-gray-500 ml-2">
                                    ({property.total_reviews || 0} reviews)
                                </span>
                            </div>
                        </div>

                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center space-x-2 text-lg">
                                    <Calendar className="h-5 w-5 text-gray-500" />
                                    <span>Stay Information</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-400 mb-1">
                                            Check-in
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            {formatDate(booking.check_in_date)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-400 mb-1">
                                            Check-out
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            {formatDate(booking.check_out_date)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between py-4 border-y border-gray-100">
                                    <div className="flex flex-col">
                                        <p className="text-xs font-bold uppercase text-gray-400">
                                            Duration
                                        </p>
                                        <p className="font-semibold text-lg">
                                            {booking.nights_stay} nights
                                        </p>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <p className="text-xs font-bold uppercase text-gray-400">
                                            Guests
                                        </p>
                                        <div className="flex items-center justify-end font-semibold text-lg">
                                            <Users className="h-5 w-5 mr-1" />
                                            {booking.guests_count}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">
                                        Total Amount Paid
                                    </p>
                                    <p className="text-3xl font-extrabold text-primary">
                                        {formatCurrency(
                                            booking.total_amount,
                                            booking.currency
                                        )}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Tabs Section */}
                <Tabs defaultValue="details" className="w-full">
                    <TabsList className="flex w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-6 overflow-x-auto">
                        {["details", "experiences", "host", "offers"].map(
                            (tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 capitalize font-semibold"
                                >
                                    {tab === "details"
                                        ? "Property Details"
                                        : tab === "offers"
                                        ? "Coupons & Offers"
                                        : tab}
                                </TabsTrigger>
                            )
                        )}
                    </TabsList>

                    <TabsContent value="details" className="mt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Amenities</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-y-4">
                                        <div className="flex items-center space-x-3">
                                            <Home className="h-5 w-5 text-gray-400" />
                                            <span className="capitalize">
                                                {property.property_type}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Users className="h-5 w-5 text-gray-400" />
                                            <span>
                                                {property.bedrooms} Bedrooms
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Wifi className="h-5 w-5 text-gray-400" />
                                            <span>Fast WiFi</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Car className="h-5 w-5 text-gray-400" />
                                            <span>Free Parking</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <PropertyRules rules={property.rules || []} />

                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>About this space</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 leading-relaxed text-lg">
                                        {property.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="host" className="mt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Host</CardTitle>
                                </CardHeader>
                                <CardContent className="flex items-center space-x-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage
                                            src={property.host_avatar}
                                        />
                                        <AvatarFallback>
                                            {property.host_name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="text-xl font-bold">
                                            {property.host_name?.split("@")[0]}
                                        </h4>
                                        <p className="text-gray-500">
                                            Host since 2023 • Verified
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                        <span className="font-medium">
                                            {property.host_email}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
