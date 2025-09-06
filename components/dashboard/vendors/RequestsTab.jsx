"use client";

import { useState } from "react";
import {
    Check,
    X,
    Clock,
    User,
    Calendar,
    DollarSign,
    MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockServiceRequests = [
    {
        id: "request-1",
        guestId: "guest-1",
        serviceId: "service-1",
        couponId: "coupon-1",
        requestDate: "2025-01-16T10:00:00Z",
        scheduledDate: "2025-01-18T15:00:00Z",
        status: "accepted",
        guestCount: 2,
        originalPrice: 240,
        discountedPrice: 192,
        message: "Looking forward to learning authentic Italian cooking!",
        vendorResponse:
            "Great! I have all the ingredients ready. See you at 3 PM.",
        createdAt: "2025-01-16T10:00:00Z",
    },
    {
        id: "request-2",
        guestId: "guest-1",
        serviceId: "service-3",
        couponId: "coupon-3",
        requestDate: "2025-01-17T20:00:00Z",
        scheduledDate: "2025-01-18T08:00:00Z",
        status: "pending",
        guestCount: 2,
        originalPrice: 70,
        discountedPrice: 63,
        message:
            "Early breakfast delivery please, we have early morning plans.",
        createdAt: "2025-01-17T20:00:00Z",
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

export const RequestsTab = () => {
    const [requests, setRequests] = useState(mockServiceRequests);
    const [services] = useState(mockServices);
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredRequests = requests.filter((request) => {
        return statusFilter === "all" || request.status === statusFilter;
    });

    const handleAcceptRequest = (requestId) => {
        setRequests((prev) =>
            prev.map((r) =>
                r.id === requestId
                    ? {
                          ...r,
                          status: "accepted",
                          vendorResponse:
                              "Request accepted! Looking forward to serving you.",
                      }
                    : r
            )
        );
    };

    const handleRejectRequest = (requestId) => {
        setRequests((prev) =>
            prev.map((r) =>
                r.id === requestId
                    ? {
                          ...r,
                          status: "rejected",
                          vendorResponse: "Sorry, not available at that time.",
                      }
                    : r
            )
        );
    };

    const handleCompleteRequest = (requestId) => {
        setRequests((prev) =>
            prev.map((r) =>
                r.id === requestId ? { ...r, status: "completed" } : r
            )
        );
    };

    const getService = (serviceId) => {
        return services.find((s) => s.id === serviceId);
    };

    const statusConfig = {
        pending: {
            color: "bg-yellow-100 text-yellow-800 border-yellow-200",
            label: "Pending",
        },
        accepted: {
            color: "bg-green-100 text-green-800 border-green-200",
            label: "Accepted",
        },
        rejected: {
            color: "bg-red-100 text-red-800 border-red-200",
            label: "Rejected",
        },
        completed: {
            color: "bg-blue-100 text-blue-800 border-blue-200",
            label: "Completed",
        },
        cancelled: {
            color: "bg-gray-100 text-gray-800 border-gray-200",
            label: "Cancelled",
        },
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Service Requests
                    </h1>
                    <p className="text-gray-600">
                        Manage incoming requests from guests
                    </p>
                </div>
            </div>

            {/* Status Filter */}
            <div className="flex space-x-2">
                {["all", "pending", "accepted", "completed"].map((status) => (
                    <Button
                        key={status}
                        variant={
                            statusFilter === status ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setStatusFilter(status)}
                        className="capitalize"
                    >
                        {status}
                        {status !== "all" && (
                            <span className="ml-2 bg-white/20 px-1 rounded text-xs">
                                {
                                    requests.filter((r) => r.status === status)
                                        .length
                                }
                            </span>
                        )}
                    </Button>
                ))}
            </div>

            {/* Requests List */}
            <div className="space-y-4">
                {filteredRequests.map((request) => {
                    const service = getService(request.serviceId);
                    const statusInfo = statusConfig[request.status];
                    const savings =
                        request.originalPrice - request.discountedPrice;

                    if (!service) return null;

                    return (
                        <div
                            key={request.id}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {service.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Request #{request.id.slice(-8)}
                                    </p>
                                </div>
                                <Badge className={`${statusInfo.color} border`}>
                                    {statusInfo.label}
                                </Badge>
                            </div>

                            {/* Request Details */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {new Date(
                                            request.scheduledDate
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <User className="w-4 h-4" />
                                    <span>{request.guestCount} guests</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <DollarSign className="w-4 h-4" />
                                    <span>${request.discountedPrice}</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {new Date(
                                        request.createdAt
                                    ).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Pricing Info */}
                            {savings > 0 && (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-emerald-800">
                                            Coupon applied
                                        </span>
                                        <span className="font-medium text-emerald-700">
                                            -${savings} discount
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Guest Message */}
                            {request.message && (
                                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                    <div className="flex items-start space-x-2">
                                        <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">
                                                Guest message:
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {request.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Vendor Response */}
                            {request.vendorResponse && (
                                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                                    <div className="flex items-start space-x-2">
                                        <MessageCircle className="w-4 h-4 text-blue-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-blue-700">
                                                Your response:
                                            </p>
                                            <p className="text-sm text-blue-600">
                                                {request.vendorResponse}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex space-x-3">
                                {request.status === "pending" && (
                                    <>
                                        <Button
                                            onClick={() =>
                                                handleRejectRequest(request.id)
                                            }
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Reject
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                handleAcceptRequest(request.id)
                                            }
                                            size="sm"
                                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                        >
                                            <Check className="w-4 h-4 mr-2" />
                                            Accept
                                        </Button>
                                    </>
                                )}

                                {request.status === "accepted" && (
                                    <Button
                                        onClick={() =>
                                            handleCompleteRequest(request.id)
                                        }
                                        size="sm"
                                        className="ml-auto bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        Mark as Completed
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredRequests.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No requests found
                    </h3>
                    <p className="text-gray-500">
                        Requests will appear here when guests book your
                        services.
                    </p>
                </div>
            )}
        </div>
    );
};
