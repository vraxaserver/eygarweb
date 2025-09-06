"use client";

import { useState } from "react";
import { Star, MessageCircle, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockReviews = [
    {
        id: "review-1",
        serviceId: "service-1",
        guestId: "guest-1",
        requestId: "request-1",
        rating: 5,
        comment:
            "Amazing experience! Chef Maria was fantastic and the food was delicious. Highly recommend!",
        createdAt: "2025-01-18T18:00:00Z",
        guestName: "John Doe",
    },
    {
        id: "review-2",
        serviceId: "service-2",
        guestId: "guest-1",
        requestId: "request-old",
        rating: 5,
        comment:
            "Alex knows the city like the back of his hand. Found amazing local spots we never would have discovered.",
        createdAt: "2025-01-14T16:30:00Z",
        guestName: "John Doe",
    },
];

const mockServices = [
    {
        id: "service-1",
        vendorId: "vendor-1",
        vendorName: "Chef Maria",
        title: "Authentic Italian Cooking Class",
        description:
            "Learn to make fresh pasta and traditional Italian dishes from scratch. Includes all ingredients and wine pairing.",
        category: "Food",
        duration: 3,
        allowedGuests: 6,
        serviceArea: {
            lat: 40.7589,
            lng: -73.9851,
            radius: 5,
        },
        images: [
            "https://images.pexels.com/photos/4253320/pexels-photo-4253320.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
            "https://images.pexels.com/photos/4253302/pexels-photo-4253302.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        ],
        isActive: true,
        price: 120,
        rating: 4.8,
        reviewCount: 34,
        createdAt: "2025-01-10T10:00:00Z",
    },
    {
        id: "service-2",
        vendorId: "vendor-2",
        vendorName: "Alex Tours",
        title: "Historical City Walking Tour",
        description:
            "Discover hidden gems and fascinating stories of the city with a local expert guide. Small groups for personalized experience.",
        category: "Local Guide",
        duration: 4,
        allowedGuests: 8,
        serviceArea: {
            lat: 40.7589,
            lng: -73.9851,
            radius: 10,
        },
        images: [
            "https://images.pexels.com/photos/1141853/pexels-photo-1141853.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
            "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        ],
        isActive: true,
        price: 45,
        rating: 4.9,
        reviewCount: 127,
        createdAt: "2025-01-08T14:30:00Z",
    },
    {
        id: "service-3",
        vendorId: "vendor-1",
        vendorName: "Chef Maria",
        title: "Premium Breakfast Delivery",
        description:
            "Fresh, gourmet breakfast delivered to your property. Includes artisanal pastries, fresh fruit, and premium coffee.",
        category: "Food",
        duration: 1,
        allowedGuests: 4,
        serviceArea: {
            lat: 40.7589,
            lng: -73.9851,
            radius: 3,
        },
        images: [
            "https://images.pexels.com/photos/103124/pexels-photo-103124.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        ],
        isActive: true,
        price: 35,
        rating: 4.6,
        reviewCount: 89,
        createdAt: "2025-01-12T08:00:00Z",
    },
];

export const ReviewsTab = () => {
    const [reviews] = useState(mockReviews);
    const [services] = useState(mockServices);

    const getService = (serviceId) => {
        return services.find((s) => s.id === serviceId);
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${
                    i < rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                }`}
            />
        ));
    };

    const averageRating =
        reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviews.length
            : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Reviews
                    </h1>
                    <p className="text-gray-600">
                        Customer feedback for your services
                    </p>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                            <Star className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {averageRating.toFixed(1)}
                            </p>
                            <p className="text-sm text-gray-600">
                                Average Rating
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                            <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {reviews.length}
                            </p>
                            <p className="text-sm text-gray-600">
                                Total Reviews
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {new Set(reviews.map((r) => r.guestId)).size}
                            </p>
                            <p className="text-sm text-gray-600">
                                Unique Guests
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map((review) => {
                    const service = getService(review.serviceId);

                    return (
                        <div
                            key={review.id}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {service?.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        by {review.guestName}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-1">
                                    {renderStars(review.rating)}
                                    <span className="ml-2 text-sm font-medium text-gray-700">
                                        {review.rating}/5
                                    </span>
                                </div>
                            </div>

                            {/* Review Content */}
                            <div className="mb-4">
                                <p className="text-gray-700">
                                    {review.comment}
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {new Date(
                                            review.createdAt
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                    {service?.category}
                                </Badge>
                            </div>
                        </div>
                    );
                })}
            </div>

            {reviews.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No reviews yet
                    </h3>
                    <p className="text-gray-500">
                        Reviews will appear here after guests use your services.
                    </p>
                </div>
            )}
        </div>
    );
};
