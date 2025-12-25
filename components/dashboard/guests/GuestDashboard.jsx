"use client";

import React, { useCallback, useMemo, useState, memo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingCard as BookingCardBase } from "@/components/dashboard/guests/BookingCard";
import { BookingDetail } from "@/components/dashboard/guests/BookingDetails";
import { Calendar, History, User } from "lucide-react";
import { useListBookingsQuery } from "@/store/features/bookingApi";
import { getBookingState } from "@/lib/bookingUtils";

/**
 * Defensive helpers
 */
function normalizeBookings(payload) {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.items)) return payload.items;
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.results)) return payload.results;
    return [];
}

function getBookingId(b) {
    const id = b?.id ?? b?._id ?? b?.booking_id ?? null;
    return typeof id === "string" || typeof id === "number" ? String(id) : null;
}

function getPropertyTitle(b) {
    return (
        b?.property_snapshot?.title ??
        b?.property_snapshot?.name ??
        b?.property?.title ??
        b?.property?.name ??
        "Property"
    );
}

function getErrorMessage(error) {
    if (!error) return "Unknown error";
    if (typeof error === "string") return error;
    // RTK Query can return FetchBaseQueryError or SerializedError shapes
    return (
        error?.data?.message ||
        error?.error ||
        error?.message ||
        "Unknown error"
    );
}

/**
 * Memoized wrapper to avoid re-rendering cards unnecessarily when parent state changes.
 * (Assumes BookingCard is a pure-ish component.)
 */
const BookingCard = memo(function BookingCard(props) {
    return <BookingCardBase {...props} />;
});

export default function GuestDashboard() {
    const [selectedBookingId, setSelectedBookingId] = useState(null);

    // Use RTK Query defaults; add refetch helpers for better UX without extra renders.
    const { data, isLoading, isFetching, isError, error, refetch } =
        useListBookingsQuery(undefined, {
            // Avoid refetching on every focus if you prefer; adjust to your UX.
            refetchOnFocus: false,
            refetchOnReconnect: true,
        });

    const bookings = useMemo(() => normalizeBookings(data), [data]);

    /**
     * Build a fast lookup map so selecting by id doesn't store a large object in state.
     * This prevents stale-object issues when data refreshes and reduces renders.
     */
    const bookingById = useMemo(() => {
        const map = new Map();
        for (const b of bookings) {
            const id = getBookingId(b);
            if (id) map.set(id, b);
        }
        return map;
    }, [bookings]);

    const selectedBooking = useMemo(() => {
        if (!selectedBookingId) return null;
        return bookingById.get(selectedBookingId) ?? null;
    }, [selectedBookingId, bookingById]);

    /**
     * Classification: fix bug where activeBooking was an array but used as a single booking.
     * Here we choose the first active booking as "current stay" and keep any others in list.
     */
    const { upcomingBookings, activeBookings, activeBooking, pastBookings } =
        useMemo(() => {
            const upcoming = [];
            const active = [];
            const past = [];

            for (const b of bookings) {
                const state = getBookingState(b);

                if (state === "history") {
                    past.push(b);
                    continue;
                }

                if (
                    state === "active_checked_in" ||
                    state === "needs_checkin"
                ) {
                    active.push(b);
                    continue;
                }

                if (state === "upcoming") {
                    upcoming.push(b);
                }
            }

            // Stable ordering helps UI feel consistent (optional; safe for perf).
            // Upcoming: nearest check-in first
            upcoming.sort((a, b) => {
                const da = new Date(a?.check_in_date ?? 0).getTime();
                const db = new Date(b?.check_in_date ?? 0).getTime();
                return da - db;
            });

            // Past: most recent checkout first
            past.sort((a, b) => {
                const da = new Date(a?.check_out_date ?? 0).getTime();
                const db = new Date(b?.check_out_date ?? 0).getTime();
                return db - da;
            });

            // Active: nearest checkout first
            active.sort((a, b) => {
                const da = new Date(a?.check_out_date ?? 0).getTime();
                const db = new Date(b?.check_out_date ?? 0).getTime();
                return da - db;
            });

            return {
                upcomingBookings: upcoming,
                activeBookings: active,
                activeBooking: active.length ? active[0] : null,
                pastBookings: past,
            };
        }, [bookings]);

    const defaultTab = useMemo(
        () => (activeBooking ? "active" : "upcoming"),
        [activeBooking]
    );

    const handleBookingClick = useCallback((booking) => {
        const id = getBookingId(booking);
        if (id) setSelectedBookingId(id);
    }, []);

    const handleBackToDashboard = useCallback(() => {
        setSelectedBookingId(null);
    }, []);

    // Detail view
    if (selectedBooking) {
        return (
            <BookingDetail
                booking={selectedBooking}
                onBack={handleBackToDashboard}
            />
        );
    }

    // Loading state (show a consistent layout to reduce CLS)
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white border rounded-lg p-6 max-w-lg w-full">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        Loading bookings
                    </h2>
                    <p className="text-sm text-gray-600">Please wait…</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white border rounded-lg p-6 max-w-lg w-full">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        Failed to load bookings
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                        {getErrorMessage(error)}
                    </p>
                    <button
                        className="px-4 py-2 rounded-md bg-gray-900 text-white"
                        onClick={refetch}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <div className="bg-pink-600 rounded-lg p-2">
                                <User className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">
                                    Guest Dashboard
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Welcome back
                                </p>
                            </div>
                        </div>

                        <button
                            className="text-sm px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50 disabled:opacity-60"
                            onClick={refetch}
                            disabled={isFetching}
                            title={isFetching ? "Refreshing..." : "Refresh"}
                        >
                            {isFetching ? "Refreshing…" : "Refresh"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs defaultValue={defaultTab} className="w-full">
                    <TabsList
                        className={`grid w-full ${
                            activeBooking ? "grid-cols-3" : "grid-cols-2"
                        } mb-8`}
                    >
                        {activeBooking && (
                            <TabsTrigger
                                value="active"
                                className="flex items-center space-x-2"
                            >
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span>Active Booking</span>
                            </TabsTrigger>
                        )}

                        <TabsTrigger
                            value="upcoming"
                            className="flex items-center space-x-2"
                        >
                            <Calendar className="h-4 w-4" />
                            <span>Upcoming Bookings</span>
                        </TabsTrigger>

                        <TabsTrigger
                            value="history"
                            className="flex items-center space-x-2"
                        >
                            <History className="h-4 w-4" />
                            <span>Booking History</span>
                        </TabsTrigger>
                    </TabsList>

                    {activeBooking && (
                        <TabsContent value="active" className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Current Stay
                                </h2>

                                <Badge className="bg-green-500 hover:bg-green-600 text-white">
                                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                                    Checked In
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 max-w-md">
                                <BookingCard
                                    booking={activeBooking}
                                    onClick={() =>
                                        handleBookingClick(activeBooking)
                                    }
                                    isActive
                                />
                            </div>

                            {/* If you have multiple active bookings, you can optionally show them here */}
                            {activeBookings.length > 1 && (
                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-gray-900">
                                        Other active bookings
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {activeBookings.slice(1).map((b) => (
                                            <BookingCard
                                                key={
                                                    getBookingId(b) ??
                                                    `${
                                                        b?.property_id ?? "prop"
                                                    }-${
                                                        b?.check_in_date ?? "na"
                                                    }`
                                                }
                                                booking={b}
                                                onClick={() =>
                                                    handleBookingClick(b)
                                                }
                                                isActive
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Card className="bg-green-50 border-green-200">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-green-500 rounded-full p-2">
                                            <Calendar className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-green-800">
                                                Enjoy Your Stay
                                            </h3>
                                            <p className="text-green-700 text-sm">
                                                You&apos;re currently checked in
                                                at{" "}
                                                {getPropertyTitle(
                                                    activeBooking
                                                )}
                                                . Need assistance? Contact your
                                                host directly.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    )}

                    <TabsContent value="upcoming" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Upcoming Trips
                            </h2>
                            <p className="text-gray-500">
                                {upcomingBookings.length} booking(s)
                            </p>
                        </div>

                        {upcomingBookings.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No upcoming bookings
                                </h3>
                                <p className="text-gray-500">
                                    Your next adventure awaits.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {upcomingBookings.map((booking) => (
                                    <BookingCard
                                        key={
                                            getBookingId(booking) ??
                                            `${
                                                booking?.property_id ?? "prop"
                                            }-${booking?.check_in_date ?? "na"}`
                                        }
                                        booking={booking}
                                        onClick={() =>
                                            handleBookingClick(booking)
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="history" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Booking History
                            </h2>
                            <p className="text-gray-500">
                                {pastBookings.length} booking(s)
                            </p>
                        </div>

                        {pastBookings.length === 0 ? (
                            <div className="text-center py-12">
                                <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No booking history
                                </h3>
                                <p className="text-gray-500">
                                    Your travel memories will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pastBookings.map((booking) => (
                                    <BookingCard
                                        key={
                                            getBookingId(booking) ??
                                            `${
                                                booking?.property_id ?? "prop"
                                            }-${
                                                booking?.check_out_date ?? "na"
                                            }`
                                        }
                                        booking={booking}
                                        onClick={() =>
                                            handleBookingClick(booking)
                                        }
                                        isPast
                                        onView={() =>
                                            handleBookingClick(booking)
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
