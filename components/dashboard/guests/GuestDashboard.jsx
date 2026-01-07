"use client";

import React, { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookingCard } from "@/components/dashboard/guests/BookingCard";
import { BookingDetail } from "@/components/dashboard/guests/BookingDetails";
import { Calendar, History, User } from "lucide-react";
import {
    useListBookingsQuery,
    useUpdateBookingCheckInMutation,
} from "@/store/features/bookingApi";
import { getBookingState } from "@/lib/bookingUtils";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

/**
 * Defensive helpers
 */
function normalizeBookings(payload) {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.items)) return payload.items;
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.results)) return payload.results;
    if (payload.items === null) return [];
    return [];
}

function isValidBooking(b) {
    return b && typeof b === "object";
}

function getBookingId(b) {
    const id = b?.id ?? b?._id ?? b?.booking_id ?? null;
    return typeof id === "string" || typeof id === "number" ? String(id) : null;
}

function getErrorMessage(error) {
    if (!error) return "Unknown error";
    if (typeof error === "string") return error;
    return (
        error?.data?.message ||
        error?.error ||
        error?.message ||
        "Unknown error"
    );
}

function EmptyState({ title, description }) {
    return (
        <div className="bg-white border rounded-lg p-8 text-center">
            <div className="text-lg font-semibold text-gray-900">{title}</div>
            <div className="mt-2 text-sm text-gray-600">{description}</div>
        </div>
    );
}

function LoadingState({ title = "Loading...", description = "Please wait." }) {
    return (
        <div className="bg-white border rounded-lg p-8 text-center">
            <div className="text-lg font-semibold text-gray-900">{title}</div>
            <div className="mt-2 text-sm text-gray-600">{description}</div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="border rounded-lg bg-gray-50 p-4 animate-pulse"
                    >
                        <div className="h-5 w-2/3 bg-gray-200 rounded" />
                        <div className="mt-3 h-4 w-1/2 bg-gray-200 rounded" />
                        <div className="mt-6 h-24 w-full bg-gray-200 rounded" />
                        <div className="mt-4 h-9 w-full bg-gray-200 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function GuestDashboard() {
    const [selectedBookingId, setSelectedBookingId] = useState(null);

    const { data, isLoading, isFetching, isError, error, refetch } =
        useListBookingsQuery(undefined, {
            refetchOnFocus: false,
            refetchOnReconnect: true,
        });

    const [updateCheckIn, { isLoading: isCheckinLoading }] =
        useUpdateBookingCheckInMutation();

    // Normalize and validate once
    const bookings = useMemo(() => {
        return normalizeBookings(data).filter(isValidBooking);
    }, [data]);

    const bookingById = useMemo(() => {
        const m = new Map();
        for (const b of bookings) {
            const id = getBookingId(b);
            if (id) m.set(id, b);
        }
        return m;
    }, [bookings]);

    const selectedBooking = selectedBookingId
        ? bookingById.get(selectedBookingId) ?? null
        : null;

    const { upcomingBookings, activeBookings, pastBookings } = useMemo(() => {
        const upcoming = [];
        const active = [];
        const past = [];

        for (const b of bookings) {
            let state;
            try {
                state = getBookingState(b);
            } catch {
                continue;
            }

            if (state === "history") {
                past.push(b);
            } else if (
                state === "active_checked_in" ||
                state === "needs_checkin"
            ) {
                active.push(b);
            } else if (state === "upcoming") {
                upcoming.push(b);
            }
        }

        const safeTime = (v) => {
            const t = new Date(v ?? 0).getTime();
            return Number.isFinite(t) ? t : 0;
        };

        upcoming.sort(
            (a, b) => safeTime(a?.check_in_date) - safeTime(b?.check_in_date)
        );
        past.sort(
            (a, b) => safeTime(b?.check_out_date) - safeTime(a?.check_out_date)
        );
        active.sort(
            (a, b) => safeTime(a?.check_out_date) - safeTime(b?.check_out_date)
        );

        return {
            upcomingBookings: upcoming,
            activeBookings: active,
            pastBookings: past,
        };
    }, [bookings]);

    const activeBooking = activeBookings.length ? activeBookings[0] : null;
    const defaultTab = activeBooking ? "active" : "upcoming";

    const isBusy = isLoading || isFetching;
    const hasAnyBookings = bookings.length > 0;

    const handleBookingClick = (booking) => {
        const id = getBookingId(booking);
        if (id) setSelectedBookingId(id);
    };

    const handleBackToDashboard = () => {
        setSelectedBookingId(null);
    };

    const handleCheckin = async (booking) => {
        const id = getBookingId(booking);
        if (!id) return;

        try {
            await updateCheckIn({ bookingId: id }).unwrap();
        } catch (err) {
            console.error("Failed to check in:", err);
        }
    };

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
                        >
                            {isFetching
                                ? "Refreshing…"
                                : isLoading
                                ? "Loading…"
                                : "Refresh"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Global states for the dashboard */}
                {isBusy && !hasAnyBookings ? (
                    <LoadingState
                        title="Loading your bookings"
                        description="Fetching the latest booking information…"
                    />
                ) : !isBusy && !hasAnyBookings ? (
                    <EmptyState
                        title="No bookings yet"
                        description="When you make your first reservation, it will appear here in your dashboard."
                    />
                ) : (
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
                                        onView={() =>
                                            handleBookingClick(activeBooking)
                                        }
                                        onCheckin={() =>
                                            handleCheckin(activeBooking)
                                        }
                                        isActive
                                        disabled={isCheckinLoading}
                                    />
                                </div>

                                {activeBookings.length > 1 && (
                                    <div className="space-y-3">
                                        <div className="text-sm font-medium text-gray-900">
                                            Other active bookings
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {activeBookings
                                                .slice(1)
                                                .map((b, idx) => (
                                                    <BookingCard
                                                        key={
                                                            getBookingId(b) ??
                                                            `active-${idx}`
                                                        }
                                                        booking={b}
                                                        onView={() =>
                                                            handleBookingClick(
                                                                b
                                                            )
                                                        }
                                                        onCheckin={() =>
                                                            handleCheckin(b)
                                                        }
                                                        isActive
                                                        disabled={
                                                            isCheckinLoading
                                                        }
                                                    />
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </TabsContent>
                        )}

                        <TabsContent value="upcoming" className="space-y-6">
                            {isBusy && upcomingBookings.length === 0 ? (
                                <LoadingState
                                    title="Loading upcoming bookings"
                                    description="Fetching upcoming reservations…"
                                />
                            ) : upcomingBookings.length === 0 ? (
                                <EmptyState
                                    title="No upcoming bookings"
                                    description="When you make a new reservation, it will appear here."
                                />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {upcomingBookings.map((booking, idx) => (
                                        <BookingCard
                                            key={
                                                getBookingId(booking) ??
                                                `upcoming-${idx}`
                                            }
                                            booking={booking}
                                            onView={() =>
                                                handleBookingClick(booking)
                                            }
                                            onCheckin={() =>
                                                handleCheckin(booking)
                                            }
                                            disabled={isCheckinLoading}
                                        />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="history" className="space-y-6">
                            {isBusy && pastBookings.length === 0 ? (
                                <LoadingState
                                    title="Loading booking history"
                                    description="Fetching past stays…"
                                />
                            ) : pastBookings.length === 0 ? (
                                <EmptyState
                                    title="No booking history"
                                    description="Once you complete a stay, it will show up here."
                                />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {pastBookings.map((booking, idx) => (
                                        <BookingCard
                                            key={
                                                getBookingId(booking) ??
                                                `history-${idx}`
                                            }
                                            booking={booking}
                                            onView={() =>
                                                handleBookingClick(booking)
                                            }
                                            isPast
                                        />
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </div>

            <Dialog
                open={!!selectedBooking}
                onOpenChange={(open) => !open && handleBackToDashboard()}
            >
                <DialogContent className="max-w-[90vw] md:max-w-[85vw] lg:max-w-[1200px] h-[90vh] overflow-y-auto p-0 bg-white shadow-lg border border-gray-200">
                    <DialogHeader className="hidden">
                        <VisuallyHidden>
                            <DialogTitle>Booking Details</DialogTitle>
                        </VisuallyHidden>
                    </DialogHeader>

                    {selectedBooking && (
                        <BookingDetail
                            booking={selectedBooking}
                            onBack={handleBackToDashboard}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
