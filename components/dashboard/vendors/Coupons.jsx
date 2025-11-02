"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Tag, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CouponForm } from "./CouponForm";

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

const mockCoupons = [
    {
        id: "coupon-1",
        serviceId: "service-1",
        code: "COOK20",
        discountPercent: 20,
        validFrom: "2025-01-15T00:00:00Z",
        validTo: "2025-01-30T23:59:59Z",
        usageLimit: 50,
        usedCount: 12,
        isActive: true,
        createdAt: "2025-01-10T10:00:00Z",
    },
    {
        id: "coupon-2",
        serviceId: "service-2",
        code: "EXPLORE15",
        discountPercent: 15,
        validFrom: "2025-01-01T00:00:00Z",
        validTo: "2025-03-31T23:59:59Z",
        usageLimit: 100,
        usedCount: 23,
        isActive: true,
        createdAt: "2025-01-08T14:30:00Z",
    },
    {
        id: "coupon-3",
        serviceId: "service-3",
        code: "BREAKFAST10",
        discountPercent: 10,
        validFrom: "2025-01-15T00:00:00Z",
        validTo: "2025-02-15T23:59:59Z",
        usageLimit: 30,
        usedCount: 8,
        isActive: true,
        createdAt: "2025-01-12T08:00:00Z",
    },
];

export const CouponsTab = () => {
    const [coupons, setCoupons] = useState(mockCoupons);
    const [services] = useState(mockServices);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const now = new Date();
    const filteredCoupons = coupons.filter((coupon) => {
        const matchesSearch = coupon.code
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const isExpired = new Date(coupon.validTo) < now;
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "valid" && !isExpired) ||
            (statusFilter === "expired" && isExpired);
        return matchesSearch && matchesStatus;
    });

    const handleCreateCoupon = () => {
        setEditingCoupon(null);
        setIsFormOpen(true);
    };

    const handleEditCoupon = (coupon) => {
        setEditingCoupon(coupon);
        setIsFormOpen(true);
    };

    const handleDeleteCoupon = (couponId) => {
        setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    };

    const handleSubmitCoupon = (data) => {
        if (editingCoupon) {
            setCoupons((prev) =>
                prev.map((c) =>
                    c.id === editingCoupon.id ? { ...c, ...data } : c
                )
            );
        } else {
            const newCoupon = {
                id: `coupon-${Date.now()}`,
                usedCount: 0,
                createdAt: new Date().toISOString(),
                ...data,
            };
            setCoupons((prev) => [newCoupon, ...prev]);
            console.log("New Coupon data =================")
            console.log(newCoupon)
        }

    };

    const getServiceTitle = (serviceId) => {
        return (
            services.find((s) => s.id === serviceId)?.title || "Unknown Service"
        );
    };

    const isExpired = (validTo) => new Date(validTo) < now;

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Coupons
                        </h1>
                        <p className="text-gray-600">
                            Manage discount coupons for your services
                        </p>
                    </div>
                    <Button
                        onClick={handleCreateCoupon}
                        className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Coupon
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search coupons by code..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex space-x-2">
                        {["all", "valid", "expired"].map((status) => (
                            <Button
                                key={status}
                                variant={
                                    statusFilter === status
                                        ? "default"
                                        : "outline"
                                }
                                size="sm"
                                onClick={() => setStatusFilter(status)}
                                className="capitalize"
                            >
                                {status}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Coupons Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCoupons.map((coupon) => {
                        const expired = isExpired(coupon.validTo);
                        const usagePercent =
                            (coupon.usedCount / coupon.usageLimit) * 100;

                        return (
                            <div
                                key={coupon.id}
                                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                            >
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-2">
                                            <Tag className="w-5 h-5 text-orange-500" />
                                            <span className="font-mono text-lg font-bold text-gray-900">
                                                {coupon.code}
                                            </span>
                                        </div>
                                        <div className="flex space-x-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleEditCoupon(coupon)
                                                }
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleDeleteCoupon(
                                                        coupon.id
                                                    )
                                                }
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Discount */}
                                    <div className="text-center mb-4">
                                        <span className="text-3xl font-bold text-emerald-600">
                                            {coupon.discountPercent}%
                                        </span>
                                        <span className="text-gray-600 ml-1">
                                            OFF
                                        </span>
                                    </div>

                                    {/* Service */}
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-500 mb-1">
                                            Service:
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {getServiceTitle(coupon.serviceId)}
                                        </p>
                                    </div>

                                    {/* Status */}
                                    <div className="mb-4">
                                        <Badge
                                            variant={
                                                expired
                                                    ? "destructive"
                                                    : coupon.isActive
                                                    ? "default"
                                                    : "secondary"
                                            }
                                            className="w-full justify-center"
                                        >
                                            {expired
                                                ? "Expired"
                                                : coupon.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </div>

                                    {/* Usage */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                                            <span>Usage</span>
                                            <span>
                                                {coupon.usedCount}/
                                                {coupon.usageLimit}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${Math.min(
                                                        usagePercent,
                                                        100
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Dates */}
                                    <div className="text-xs text-gray-500 space-y-1">
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>
                                                Valid:{" "}
                                                {new Date(
                                                    coupon.validFrom
                                                ).toLocaleDateString()}{" "}
                                                -{" "}
                                                {new Date(
                                                    coupon.validTo
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredCoupons.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Tag className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No coupons found
                        </h3>
                        <p className="text-gray-500 mb-4">
                            Create your first coupon to attract more customers.
                        </p>
                        <Button onClick={handleCreateCoupon}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Coupon
                        </Button>
                    </div>
                )}
            </div>

            {/* Coupon Form Modal */}
            <CouponForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                coupon={editingCoupon}
                services={services}
                onSubmit={handleSubmitCoupon}
            />
        </>
    );
};
