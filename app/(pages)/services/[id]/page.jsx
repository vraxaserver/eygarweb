"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { 
    useGetServiceByIdQuery 
} from "@/store/features/vendorServiceApi";
import { 
    useGetCouponsQuery 
} from "@/store/features/vendorCouponApi";
import { 
    ArrowLeft, 
    Clock, 
    Users, 
    Tag, 
    Calendar, 
    Star, 
    MapPin, 
    CheckCircle2, 
    Shield, 
    MessageSquare,
    Sparkles,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ServiceDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const couponCode = searchParams.get("coupon") || "";
    const bookingId = searchParams.get("bookingId") || "";

    const user = useSelector((state) => state.auth.user);

    const { data: service, isLoading: isServiceLoading, isError: isServiceError } = useGetServiceByIdQuery(id, { skip: !id });
    const { data: coupons } = useGetCouponsQuery();

    const [guestCount, setGuestCount] = useState(1);
    const [scheduledDate, setScheduledDate] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Find pre-applied coupon details
    const matchedCoupon = (coupons || []).find(
        (c) => c.code.toLowerCase() === couponCode.toLowerCase() && c.isActive
    );

    const discountValue = matchedCoupon ? matchedCoupon.discountValue : 0;
    const discountType = matchedCoupon ? matchedCoupon.discountType : "percentage";

    const originalPrice = service ? service.price * guestCount : 0;
    
    let discountAmount = 0;
    if (matchedCoupon) {
        if (discountType === "percentage") {
            discountAmount = (originalPrice * discountValue) / 100;
        } else {
            discountAmount = discountValue;
        }
    }
    const finalPrice = Math.max(0, originalPrice - discountAmount);

    const handleBook = () => {
        if (!scheduledDate) {
            setErrorMsg("Please select a date and time for the service.");
            return;
        }
        setErrorMsg("");

        const newRequest = {
            id: `req-${Date.now()}`,
            guestId: user?.id || "guest-1",
            guestName: user?.name || user?.email || "Guest",
            serviceId: service.id,
            serviceTitle: service.title,
            couponId: matchedCoupon?.id || null,
            couponCode: matchedCoupon?.code || null,
            requestDate: new Date().toISOString(),
            scheduledDate: new Date(scheduledDate).toISOString(),
            status: "pending",
            guestCount: Number(guestCount),
            originalPrice: originalPrice,
            discountedPrice: finalPrice,
            message: message,
            createdAt: new Date().toISOString(),
        };

        // Save to localStorage so it syncs with vendor dashboard Requests tab
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("eygar_service_requests");
            const requestsList = saved ? JSON.parse(saved) : [];
            requestsList.push(newRequest);
            localStorage.setItem("eygar_service_requests", JSON.stringify(requestsList));
        }

        setSuccess(true);
    };

    if (isServiceLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50 space-y-4">
                <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">Loading service details...</p>
            </div>
        );
    }

    if (isServiceError || !service) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-center bg-gray-50 p-6">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Service Not Found</h2>
                <p className="text-gray-600 mb-6 max-w-sm">
                    We couldn't retrieve the service details. The service may have been deactivated or removed.
                </p>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Sticky Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm font-semibold transition"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back</span>
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Service Details</h1>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {success ? (
                    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border border-emerald-100 text-center animate-fade-in space-y-6">
                        <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Request Submitted!</h2>
                            <p className="text-sm text-gray-500 mt-2">
                                Your service request has been sent to <strong>{service.vendorName}</strong>. They will verify your booking and respond shortly.
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 text-left border border-gray-100 text-xs space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Service:</span>
                                <span className="font-semibold text-gray-900">{service.title}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Date/Time:</span>
                                <span className="font-semibold text-gray-900">{new Date(scheduledDate).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Guests:</span>
                                <span className="font-semibold text-gray-900">{guestCount}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t text-gray-900 font-bold text-sm">
                                <span>Total Paid:</span>
                                <span>${finalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        <Button 
                            className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-semibold"
                            onClick={() => router.push("/dashboard")}
                        >
                            Return to Dashboard
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Main Service Details */}
                        <div className="lg:col-span-8 space-y-8">
                            <div className="relative h-[320px] md:h-[450px] overflow-hidden rounded-2xl shadow-md bg-gray-200">
                                {service.image ? (
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50">
                                        <Sparkles className="h-16 w-16 text-rose-300" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <Badge className="bg-rose-600 hover:bg-rose-700 text-white text-sm py-1 px-3">
                                        {service.category}
                                    </Badge>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
                                <div>
                                    <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
                                        {service.title}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Provided by <span className="font-semibold text-gray-700">{service.vendorName}</span>
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-4 py-4 border-y border-gray-100 text-sm text-gray-600">
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border">
                                        <Clock className="w-4 h-4 text-rose-500" />
                                        <span>Duration: <strong>{service.duration} hour{service.duration !== 1 ? "s" : ""}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border">
                                        <Users className="w-4 h-4 text-rose-500" />
                                        <span>Allowed Guests: <strong>{service.allowedGuests} max</strong></span>
                                    </div>
                                    {service.rating > 0 && (
                                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span><strong>{service.rating}</strong> ({service.reviewCount || 0} reviews)</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-gray-900">About this Service</h3>
                                    <p className="text-gray-700 leading-relaxed text-base">
                                        {service.description}
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 bg-rose-50/50 rounded-xl p-4 border border-rose-100/50">
                                    <Shield className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-sm text-gray-900">Local Area Guarantee</h4>
                                        <p className="text-xs text-gray-500 mt-1">
                                            This service is validated within your property's stay zone. Booking requests are secured with full host coordination.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Request Card */}
                        <div className="lg:col-span-4 lg:sticky lg:top-24">
                            <Card className="border-gray-200 shadow-lg bg-white rounded-2xl">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-xl font-bold flex items-center justify-between text-gray-900">
                                        <span>Request Booking</span>
                                        <span className="text-2xl font-extrabold text-rose-600">${service.price}<span className="text-xs text-gray-500 font-normal"> / person</span></span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Pre-applied coupon alert */}
                                    {matchedCoupon && (
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-2.5">
                                            <Tag className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-semibold text-emerald-900">Coupon Code Applied!</p>
                                                <p className="text-[11px] text-emerald-700 mt-0.5">
                                                    <strong>{matchedCoupon.code}</strong> yields {discountType === "percentage" ? `${discountValue}%` : `$${discountValue}`} discount.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        {/* Scheduled Date picker */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                Date & Time
                                            </label>
                                            <input
                                                type="datetime-local"
                                                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                                                value={scheduledDate}
                                                onChange={(e) => setScheduledDate(e.target.value)}
                                            />
                                        </div>

                                        {/* Guest selector */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1.5">
                                                <Users className="w-3.5 h-3.5 text-gray-400" />
                                                Guest Count
                                            </label>
                                            <select
                                                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                                                value={guestCount}
                                                onChange={(e) => setGuestCount(Number(e.target.value))}
                                            >
                                                {Array.from({ length: service.allowedGuests || 1 }).map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        {i + 1} Guest{i > 0 ? "s" : ""}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Message textbox */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1.5">
                                                <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                                                Message (Optional)
                                            </label>
                                            <textarea
                                                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 h-24 resize-none"
                                                placeholder="Provide any custom instructions or special requests..."
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Cost breakdown */}
                                    <div className="border-t pt-4 space-y-2 text-sm">
                                        <div className="flex justify-between text-gray-500">
                                            <span>Price ({guestCount} guest{guestCount > 1 ? "s" : ""})</span>
                                            <span>${originalPrice.toFixed(2)}</span>
                                        </div>
                                        {matchedCoupon && (
                                            <div className="flex justify-between text-emerald-600 font-medium">
                                                <span>Discount Applied</span>
                                                <span>-${discountAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between pt-2 border-t text-gray-900 font-extrabold text-base">
                                            <span>Estimated Total</span>
                                            <span>${finalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {errorMsg && (
                                        <p className="text-xs text-red-500 font-medium">{errorMsg}</p>
                                    )}

                                    <Button
                                        onClick={handleBook}
                                        className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-bold transition shadow-md hover:shadow-lg"
                                    >
                                        Request Booking
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
