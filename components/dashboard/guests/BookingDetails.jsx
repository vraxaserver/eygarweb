"use client";

import {
    ArrowLeft,
    MapPin,
    Star,
    Phone,
    Mail,
    Calendar,
    Users,
    Wifi,
    Car,
    Coffee,
    Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PropertyRules } from "@/components/dashboard/guests/PropertyRules";
import { ExperienceCard } from "@/components/dashboard/guests/ExperienceCard";
import { CouponCard } from "@/components/dashboard/guests/CouponCard";


export function BookingDetail({ booking, onBack }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getDaysBetween = (checkIn, checkOut) => {
        const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-4 h-16">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBack}
                            className="flex items-center space-x-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Back to Dashboard</span>
                        </Button>
                        <div className="h-6 w-px bg-gray-300" />
                        <h1 className="text-xl font-semibold text-gray-900">
                            Booking Details
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Property Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2">
                        <img
                            src={booking.property.image}
                            alt={booking.property.name}
                            className="w-full h-64 sm:h-80 object-cover rounded-lg shadow-md"
                        />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {booking.property.name}
                            </h2>
                            <div className="flex items-center text-gray-600 mb-4">
                                <MapPin className="h-5 w-5 mr-2" />
                                {booking.property.location}
                            </div>
                            <div className="flex items-center mb-4">
                                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                                <span className="font-medium">
                                    {booking.property.rating}
                                </span>
                                <span className="text-gray-500 ml-1">
                                    ({booking.property.reviews} reviews)
                                </span>
                            </div>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Calendar className="h-5 w-5" />
                                    <span>Booking Information</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Check-in
                                    </p>
                                    <p className="font-medium">
                                        {formatDate(booking.checkIn)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Check-out
                                    </p>
                                    <p className="font-medium">
                                        {formatDate(booking.checkOut)}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Duration
                                        </p>
                                        <p className="font-medium">
                                            {getDaysBetween(
                                                booking.checkIn,
                                                booking.checkOut
                                            )}{" "}
                                            nights
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Guests
                                        </p>
                                        <p className="font-medium flex items-center">
                                            <Users className="h-4 w-4 mr-1" />
                                            {booking.guests}
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t">
                                    <p className="text-sm text-gray-500">
                                        Total Amount
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        ${booking.totalPrice}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Detailed Information Tabs */}
                <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="details">
                            Property Details
                        </TabsTrigger>
                        <TabsTrigger value="experiences">
                            Experiences
                        </TabsTrigger>
                        <TabsTrigger value="host">Host Info</TabsTrigger>
                        <TabsTrigger value="offers">
                            Coupons & Offers
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Property Features</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        {booking.property.amenities.map(
                                            (amenity, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center space-x-2"
                                                >
                                                    {amenity === "WiFi" && (
                                                        <Wifi className="h-4 w-4 text-blue-500" />
                                                    )}
                                                    {amenity === "Parking" && (
                                                        <Car className="h-4 w-4 text-blue-500" />
                                                    )}
                                                    {amenity === "Kitchen" && (
                                                        <Coffee className="h-4 w-4 text-blue-500" />
                                                    )}
                                                    <span className="text-sm">
                                                        {amenity}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <PropertyRules rules={booking.property.rules} />
                        </div>

                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 leading-relaxed">
                                    {booking.property.description}
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="experiences" className="mt-6">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Available Experiences
                                </h3>
                                <p className="text-gray-600">
                                    Complimentary experiences offered by your
                                    host
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {booking.host.experiences.map((experience) => (
                                    <ExperienceCard
                                        key={experience.id}
                                        experience={experience}
                                    />
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="host" className="mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Meet Your Host</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage
                                                src={booking.host.avatar}
                                                alt={booking.host.name}
                                            />
                                            <AvatarFallback>
                                                {booking.host.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-semibold text-lg">
                                                {booking.host.name}
                                            </h4>
                                            <div className="flex items-center space-x-2">
                                                <Star className="h-4 w-4 text-yellow-400" />
                                                <span className="font-medium">
                                                    {booking.host.rating}
                                                </span>
                                                <span className="text-gray-500">
                                                    ({booking.host.reviewCount}{" "}
                                                    reviews)
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                Host since{" "}
                                                {booking.host.memberSince}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-gray-700">
                                        {booking.host.bio}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {booking.host.languages.map(
                                            (language, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                >
                                                    {language}
                                                </Badge>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium">
                                                {booking.host.phone}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Available 9 AM - 9 PM
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium">
                                                {booking.host.email}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Response time: within 1 hour
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <h5 className="font-medium mb-2">
                                            House Rules & Check-in
                                        </h5>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>Check-in: 3:00 PM</li>
                                            <li>Check-out: 11:00 AM</li>
                                            <li>
                                                Key pickup: Self check-in with
                                                lockbox
                                            </li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="offers" className="mt-6">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Available Offers
                                </h3>
                                <p className="text-gray-600">
                                    Special deals and coupons for your booking
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {booking.availableCoupons.map((coupon) => (
                                    <CouponCard
                                        key={coupon.id}
                                        coupon={coupon}
                                    />
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
