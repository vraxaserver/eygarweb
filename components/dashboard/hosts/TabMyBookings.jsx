"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { getStatusColor } from "@/lib/utils";
import {
    Eye,
    MessageSquare,
    Clock,
    CheckCircle,
    AlertCircle,
    RefreshCw,
    Calendar,
    Users,
    DollarSign,
} from "lucide-react";

import {
    useHostApproveBookingMutation,
    useListHostUpcomingBookingsQuery,
} from "@/store/features/bookingApi";

const getStatusIcon = (status) => {
    switch (status) {
        case "confirmed":
        case "booking_confirmed":
        case "host_approved":
            return <CheckCircle className="w-3.5 h-3.5" />;
        case "checked_in":
            return <CheckCircle className="w-3.5 h-3.5" />;
        case "pending_payment":
        case "payment_confirmed":
            return <Clock className="w-3.5 h-3.5" />;
        default:
            return <AlertCircle className="w-3.5 h-3.5" />;
    }
};

const formatMoney = (amount, currency) => {
    if (amount == null) return "—";
    const num = Number(amount);
    return `${isNaN(num) ? "0.00" : num.toFixed(2)} ${String(currency || "").toUpperCase()}`;
};

const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
        return new Date(dateStr).toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return dateStr;
    }
};

function BookingCard({ booking, onViewDetails, onApprove, approving }) {
    const guestName =
        booking?.user_snapshot?.first_name ||
        booking?.user_snapshot?.email ||
        "Guest";
    const guestAvatar = booking?.user_snapshot?.avatar_url || "";
    const propertyTitle = booking?.property_snapshot?.title || "Property";
    const bookingStatus = booking?.booking_status || "unknown";
    const checkoutStatus = booking?.checkout_status || "";
    const displayStatus = checkoutStatus === "checked_in" ? "checked_in" : bookingStatus;
    const isApproved =
        bookingStatus === "host_approved" ||
        bookingStatus === "booking_confirmed" ||
        bookingStatus === "confirmed";
    const bookingId = booking?.id || booking?._id;

    return (
        <div className="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10 border-2 border-purple-100">
                        <AvatarImage src={guestAvatar} />
                        <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                            {String(guestName)[0]?.toUpperCase() || "G"}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-semibold text-sm text-gray-900">{guestName}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[160px]">{propertyTitle}</div>
                    </div>
                </div>
                <Badge className={`flex items-center gap-1 text-xs ${getStatusColor(displayStatus)}`}>
                    {getStatusIcon(displayStatus)}
                    <span className="capitalize">{displayStatus.replace(/_/g, " ")}</span>
                </Badge>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="flex items-center gap-1.5 text-gray-600">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    <div>
                        <div className="text-gray-400">Check-in</div>
                        <div className="font-medium text-gray-800">{formatDate(booking.check_in_date)}</div>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <div>
                        <div className="text-gray-400">Check-out</div>
                        <div className="font-medium text-gray-800">{formatDate(booking.check_out_date)}</div>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <div>
                        <div className="text-gray-400">Guests</div>
                        <div className="font-medium text-gray-800">{booking.guests_count ?? "—"}</div>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                    <DollarSign className="w-3.5 h-3.5 text-green-400" />
                    <div>
                        <div className="text-gray-400">Total</div>
                        <div className="font-medium text-gray-800">{formatMoney(booking.total_amount, booking.currency)}</div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                    <MessageSquare className="w-3.5 h-3.5 mr-1" />
                    Message
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-xs"
                    onClick={() => onViewDetails?.(booking)}
                >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    View
                </Button>

                {!isApproved && (
                    <Button
                        size="sm"
                        className="flex-1 h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                        disabled={approving}
                        onClick={() => onApprove?.(bookingId)}
                    >
                        {approving ? (
                            <RefreshCw className="w-3.5 h-3.5 mr-1 animate-spin" />
                        ) : (
                            <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        )}
                        {approving ? "Approving..." : "Approve"}
                    </Button>
                )}
            </div>
        </div>
    );
}

const TabMyBookings = ({ onViewDetails }) => {
    const { data: allBookings = [], isLoading, refetch } = useListHostUpcomingBookingsQuery(
        { limit: 100, offset: 0 }
    );
    const [hostApprove, { isLoading: approving }] = useHostApproveBookingMutation();

    const activeBookings = allBookings.filter((b) => {
        const cs = b?.checkout_status || "";
        const bs = b?.booking_status || "";
        return (
            cs === "checked_in" ||
            bs === "host_approved" ||
            bs === "booking_confirmed" ||
            bs === "confirmed"
        );
    });

    const upcomingBookings = allBookings.filter((b) => {
        const bs = b?.booking_status || "";
        const cs = b?.checkout_status || "";
        return (
            cs !== "checked_in" &&
            (bs === "pending_payment" ||
                bs === "payment_confirmed" ||
                bs === "pending")
        );
    });

    const onApprove = async (bookingId) => {
        try {
            await hostApprove({ bookingId }).unwrap();
            refetch();
        } catch (e) {
            console.error("Approve failed:", e);
        }
    };

    const renderEmpty = (msg) => (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Calendar className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">{msg}</p>
        </div>
    );

    const renderGrid = (bookings) => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="border rounded-xl p-4 animate-pulse bg-gray-50 h-40" />
                    ))}
                </div>
            );
        }
        if (!bookings.length) return renderEmpty("No bookings in this category.");
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.map((booking) => (
                    <BookingCard
                        key={booking.id || booking._id}
                        booking={booking}
                        onViewDetails={onViewDetails}
                        onApprove={onApprove}
                        approving={approving}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {/* Summary row */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Active / Checked-in", value: activeBookings.length, color: "bg-green-50 text-green-700 border-green-200" },
                    { label: "Pending Approval", value: upcomingBookings.length, color: "bg-amber-50 text-amber-700 border-amber-200" },
                    { label: "Total Bookings", value: allBookings.length, color: "bg-purple-50 text-purple-700 border-purple-200" },
                ].map((s) => (
                    <div key={s.label} className={`rounded-xl border p-3 text-center ${s.color}`}>
                        <div className="text-2xl font-bold">{isLoading ? "…" : s.value}</div>
                        <div className="text-xs mt-0.5">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid grid-cols-3 w-full mb-4">
                    <TabsTrigger value="active" className="text-xs sm:text-sm">
                        Active
                        {activeBookings.length > 0 && (
                            <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-green-600 text-white text-[10px] font-bold">
                                {activeBookings.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="upcoming" className="text-xs sm:text-sm">
                        Upcoming
                        {upcomingBookings.length > 0 && (
                            <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                                {upcomingBookings.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="all" className="text-xs sm:text-sm">
                        All
                        {allBookings.length > 0 && (
                            <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-purple-600 text-white text-[10px] font-bold">
                                {allBookings.length}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="active">
                    {renderGrid(activeBookings)}
                </TabsContent>

                <TabsContent value="upcoming">
                    {renderGrid(upcomingBookings)}
                </TabsContent>

                <TabsContent value="all">
                    {renderGrid(allBookings)}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TabMyBookings;
