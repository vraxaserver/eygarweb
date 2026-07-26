"use client";

import React, { useState } from "react";
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
    ChevronLeft,
    ChevronRight,
    Clock,
    Tag,
    Gift,
    Percent,
    Sparkles,
    AlertCircle,
    Loader2,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PropertyRules } from "@/components/dashboard/guests/PropertyRules";
import { formatCurrency } from "@/lib/utils";
import { useGetExperiencesByPropertyQuery } from "@/store/features/experienceApi";
import { useRouter } from "next/navigation";
import { useGetCouponsQuery } from "@/store/features/vendorCouponApi";

// ─── Experience Card ─────────────────────────────────────────────────────────
function ExperienceItem({ experience }) {
    const [imgError, setImgError] = useState(false);
    return (
        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
            {/* Image */}
            <div className="relative h-44 bg-gray-100">
                {experience.image && !imgError ? (
                    <img
                        src={experience.image}
                        alt={experience.title || experience.name}
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50">
                        <Sparkles className="h-10 w-10 text-rose-300" />
                    </div>
                )}
                {/* Badge overlay */}
                <div className="absolute top-3 left-3">
                    <Badge className="bg-rose-600 hover:bg-rose-700 text-white text-xs">
                        Experience
                    </Badge>
                </div>
                {!experience.is_active && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Not available</span>
                    </div>
                )}
            </div>

            <CardContent className="p-4 space-y-3">
                <h4 className="font-semibold text-gray-900 text-base leading-snug">
                    {experience.title || experience.name}
                </h4>
                {experience.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{experience.description}</p>
                )}

                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    {experience.duration && (
                        <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {experience.duration}h
                        </span>
                    )}
                    {experience.max_participants && (
                        <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            Up to {experience.max_participants}
                        </span>
                    )}
                    {experience.location_name && (
                        <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {experience.location_name}
                        </span>
                    )}
                </div>

                {experience.price_per_person != null && (
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-500">Per person</span>
                        <span className="font-bold text-gray-900">
                            {formatCurrency(experience.price_per_person, "USD")}
                        </span>
                    </div>
                )}

                {experience.is_active && (
                    <Button size="sm" className="w-full bg-rose-600 hover:bg-rose-700 text-white mt-1">
                        Book Experience
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

// ─── Coupon Card ─────────────────────────────────────────────────────────────
function CouponItem({ coupon, booking }) {
    const router = useRouter();
    const now = new Date();
    const validTo = coupon.validTo ? new Date(coupon.validTo) : null;
    const validFrom = coupon.validFrom ? new Date(coupon.validFrom) : null;
    const isExpired = validTo && validTo < now;
    const isNotStarted = validFrom && validFrom > now;
    const isValid = !isExpired && !isNotStarted && coupon.isActive;

    const daysLeft = validTo
        ? Math.ceil((validTo - now) / (1000 * 60 * 60 * 24))
        : null;

    const formatDate = (d) =>
        new Date(d).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    const handleViewService = () => {
        const serviceId = coupon.serviceId || coupon.service?.id;
        if (serviceId) {
            router.push(`/services/${serviceId}?coupon=${coupon.code}&bookingId=${booking?.id || ""}`);
        }
    };

    return (
        <Card
            className={`relative overflow-hidden border-l-4 transition-shadow hover:shadow-md flex flex-col justify-between ${
                isExpired
                    ? "border-l-gray-300 opacity-60"
                    : isValid
                    ? "border-l-rose-500"
                    : "border-l-amber-400"
            }`}
        >
            {/* Decorative blob */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-rose-100 to-transparent rounded-bl-full opacity-50" />

            <CardContent className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Gift className="h-5 w-5 text-rose-500 shrink-0" />
                            <h4 className="font-semibold text-gray-900 leading-snug">
                                {coupon.title}
                            </h4>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                            {isExpired && (
                                <Badge variant="destructive" className="text-xs">Expired</Badge>
                            )}
                            {isNotStarted && !isExpired && (
                                <Badge variant="secondary" className="text-xs">Coming soon</Badge>
                            )}
                            {isValid && daysLeft !== null && daysLeft <= 7 && (
                                <Badge variant="destructive" className="text-xs">Expires in {daysLeft}d</Badge>
                            )}
                            {isValid && (daysLeft === null || daysLeft > 7) && (
                                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs">Active</Badge>
                            )}
                        </div>
                    </div>

                    {/* Discount amount */}
                    <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-rose-500" />
                        <span className="text-xl font-extrabold text-rose-600">
                            {coupon.discountType === "percentage"
                                 ? `${coupon.discountValue}% OFF`
                                 : `$${coupon.discountValue} OFF`}
                        </span>
                    </div>

                    {/* Coupon code */}
                    <div className="flex items-center justify-between gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-1.5">
                            <Tag className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                            <span className="font-mono font-bold tracking-widest text-sm text-gray-800">
                                {coupon.code}
                            </span>
                        </div>
                        {validFrom && validTo && (
                            <span className="text-[10px] text-gray-500">
                                {formatDate(coupon.validTo)}
                            </span>
                        )}
                    </div>

                    {/* Associated Service Details */}
                    {coupon.service && (
                        <div className="border border-gray-100 rounded-lg p-3 bg-gray-50/50 space-y-2 mt-2">
                            {coupon.service.image && (
                                <div className="relative h-24 w-full rounded overflow-hidden mb-2">
                                    <img
                                        src={coupon.service.image}
                                        alt={coupon.service.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <h5 className="font-semibold text-xs text-gray-900 line-clamp-1">{coupon.service.title}</h5>
                            <p className="text-[11px] text-gray-500 line-clamp-2">{coupon.service.description}</p>
                            <div className="flex justify-between items-center text-[10px] text-gray-500 pt-1 border-t border-gray-100">
                                <span>{coupon.service.category} • {coupon.service.duration}h</span>
                                <span className="font-bold text-gray-900">${coupon.service.price}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action button */}
                {isValid && coupon.service && (
                    <Button
                        size="sm"
                        onClick={handleViewService}
                        className="w-full mt-3 bg-rose-600 hover:bg-rose-700 text-white font-medium"
                    >
                        View & Book Service
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

// ─── Section skeleton ─────────────────────────────────────────────────────────
function SectionSkeleton({ count = 3 }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-100 bg-white overflow-hidden animate-pulse">
                    <div className="h-44 bg-gray-200" />
                    <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-full" />
                        <div className="h-3 bg-gray-100 rounded w-2/3" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Empty state ─────────────────────────────────────────────────────────────
function SectionEmpty({ icon: Icon, title, subtitle }) {
    return (
        <div className="text-center py-16 col-span-full">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="font-semibold text-gray-900">{title}</p>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function BookingDetail({ booking, onBack }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!booking) return null;

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    const property = booking.property_snapshot || {};
    const location = property.location || {};
    const images = property.images || [];
    const propertyId = booking.property_id || property.id;

    // Slider handlers
    const nextSlide = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };
    const prevSlide = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <div className="w-full bg-white">
            {/* Sticky Header */}
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
                    {/* Image Slider */}
                    <div className="lg:col-span-7 relative h-[300px] md:h-[450px] group overflow-hidden rounded-xl shadow-sm bg-gray-100">
                        {images.length > 0 ? (
                            <>
                                <div className="w-full h-full relative">
                                    {images.map((img, idx) => (
                                        <div
                                            key={img.id || idx}
                                            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                                                idx === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                                            }`}
                                        >
                                            <img
                                                src={img.image_url}
                                                alt={`${property.title} - ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>

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

                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                                            {images.map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`h-1.5 rounded-full transition-all ${
                                                        idx === currentImageIndex
                                                            ? "w-6 bg-white"
                                                            : "w-1.5 bg-white/50"
                                                    }`}
                                                />
                                            ))}
                                        </div>

                                        <div className="absolute top-4 right-4 z-20 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                                            {currentImageIndex + 1} / {images.length}
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
                                <MapPin className="h-5 w-5 mr-2 text-rose-600" />
                                {location.city}, {location.country}
                            </div>
                            <div className="flex items-center mb-4">
                                <Star className="h-5 w-5 text-yellow-400 mr-1 fill-current" />
                                <span className="font-bold text-lg">
                                    {property.average_rating > 0 ? property.average_rating : "New"}
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
                                        <p className="text-xs font-bold uppercase text-gray-400 mb-1">Check-in</p>
                                        <p className="font-semibold text-gray-900">
                                            {formatDate(booking.check_in_date)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-400 mb-1">Check-out</p>
                                        <p className="font-semibold text-gray-900">
                                            {formatDate(booking.check_out_date)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between py-4 border-y border-gray-100">
                                    <div className="flex flex-col">
                                        <p className="text-xs font-bold uppercase text-gray-400">Duration</p>
                                        <p className="font-semibold text-lg">{booking.nights_stay} nights</p>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <p className="text-xs font-bold uppercase text-gray-400">Guests</p>
                                        <div className="flex items-center justify-end font-semibold text-lg">
                                            <Users className="h-5 w-5 mr-1" />
                                            {booking.guests_count}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Total Amount Paid</p>
                                    <p className="text-3xl font-extrabold text-rose-600">
                                        {formatCurrency(booking.total_amount, booking.currency)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Tabs Section */}
                <Tabs defaultValue="details" className="w-full">
                    <TabsList className="flex w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-6 overflow-x-auto gap-0">
                        {["details", "experiences", "host", "offers"].map((tab) => (
                            <TabsTrigger
                                key={tab}
                                value={tab}
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-rose-600 data-[state=active]:bg-transparent px-6 py-3 capitalize font-semibold whitespace-nowrap"
                            >
                                {tab === "details"
                                    ? "Property Details"
                                    : tab === "offers"
                                    ? "Coupons & Offers"
                                    : tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* ── Property Details tab ── */}
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
                                            <span className="capitalize">{property.property_type}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Users className="h-5 w-5 text-gray-400" />
                                            <span>{property.bedrooms} Bedrooms</span>
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

                    {/* ── Experiences tab ── */}
                    <TabsContent value="experiences" className="mt-0">
                        <ExperiencesSection propertyId={propertyId} />
                    </TabsContent>

                    {/* ── Host tab ── */}
                    <TabsContent value="host" className="mt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Host</CardTitle>
                                </CardHeader>
                                <CardContent className="flex items-center space-x-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src={property.host_avatar} />
                                        <AvatarFallback>{property.host_name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="text-xl font-bold">{property.host_name?.split("@")[0]}</h4>
                                        <p className="text-gray-500">Host since 2023 • Verified</p>
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
                                        <span className="font-medium">{property.host_email}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* ── Coupons & Offers tab ── */}
                    <TabsContent value="offers" className="mt-0">
                        <CouponsSection booking={booking} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

// ─── Experiences Section (lazy-fetches when tab is rendered) ──────────────────
function ExperiencesSection({ propertyId }) {
    const {
        data: experiences,
        isLoading,
        isError,
    } = useGetExperiencesByPropertyQuery(propertyId, { skip: !propertyId });

    if (!propertyId) {
        return (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm">Property ID not available for this booking.</p>
            </div>
        );
    }

    if (isLoading) return <SectionSkeleton count={3} />;

    if (isError) {
        return (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm">Failed to load experiences. Please try again.</p>
            </div>
        );
    }

    if (!experiences || experiences.length === 0) {
        return (
            <SectionEmpty
                icon={Sparkles}
                title="No experiences available"
                subtitle="There are no experiences attached to this property yet."
            />
        );
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-500">
                {experiences.length} experience{experiences.length !== 1 ? "s" : ""} available at this property
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.map((exp) => (
                    <ExperienceItem key={exp.id} experience={exp} />
                ))}
            </div>
        </div>
    );
}

// Distance calculation helper (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return Infinity;
    const R = 6371; // Radius of the earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// ─── Coupons Section (fetches all active public coupons) ──────────────────────
function CouponsSection({ booking }) {
    const {
        data: coupons,
        isLoading,
        isError,
    } = useGetCouponsQuery();

    if (booking?.checkout_status !== "checked_in") {
        return (
            <div className="text-center py-16">
                <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-rose-500 animate-pulse" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">Check-in to Unlock Offers</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                    Once you check in to your stay, exclusive local vendor coupons and service requests will be unlocked here!
                </p>
            </div>
        );
    }

    if (isLoading) return <SectionSkeleton count={3} />;

    if (isError) {
        return (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm">Failed to load coupons. Please try again.</p>
            </div>
        );
    }

    // Filter to only active & not expired coupons for display
    const now = new Date();
    const propertyLocation = booking?.property_snapshot?.location || {};
    const propLat = propertyLocation.latitude ?? propertyLocation.lat;
    const propLng = propertyLocation.longitude ?? propertyLocation.lng;

    const isCouponInArea = (c) => {
        if (!c.service) return true;
        const serviceArea = c.service.serviceArea || {};
        const serviceLat = serviceArea.lat ?? serviceArea.latitude;
        const serviceLng = serviceArea.lng ?? serviceArea.longitude;
        const radius = serviceArea.radius ?? 10; // km
        if (propLat != null && propLng != null && serviceLat != null && serviceLng != null) {
            const dist = calculateDistance(propLat, propLng, serviceLat, serviceLng);
            return dist <= radius;
        }
        return true;
    };

    const activeCoupons = (coupons || []).filter((c) => {
        const expired = c.validTo && new Date(c.validTo) < now;
        return c.isActive && !expired && isCouponInArea(c);
    });
    const expiredCoupons = (coupons || []).filter((c) => {
        const expired = c.validTo && new Date(c.validTo) < now;
        return (expired || !c.isActive) && isCouponInArea(c);
    });

    if (!coupons || coupons.length === 0 || (activeCoupons.length === 0 && expiredCoupons.length === 0)) {
        return (
            <SectionEmpty
                icon={Tag}
                title="No coupons available"
                subtitle="Check back later for discount offers and coupons."
            />
        );
    }

    return (
        <div className="space-y-8">
            {/* Active coupons */}
            {activeCoupons.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-rose-500" />
                        <h3 className="font-semibold text-gray-900 text-lg">
                            Available Offers ({activeCoupons.length})
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeCoupons.map((coupon) => (
                            <CouponItem key={coupon.id} coupon={coupon} booking={booking} />
                        ))}
                    </div>
                </div>
            )}

            {/* Expired / inactive coupons */}
            {expiredCoupons.length > 0 && (
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-500 text-base">
                        Expired / Inactive ({expiredCoupons.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {expiredCoupons.map((coupon) => (
                            <CouponItem key={coupon.id} coupon={coupon} booking={booking} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
