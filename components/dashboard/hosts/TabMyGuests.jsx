"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";
import { Eye, MessageSquare } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { useListHostUpcomingBookingsQuery } from "@/store/features/bookingApi";

const safeInitials = (nameOrEmail) => {
    if (!nameOrEmail) return "G";
    const parts = String(nameOrEmail).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
};

const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
};

const TabMyGuests = () => {
    const { data: upcoming = [], isLoading } = useListHostUpcomingBookingsQuery(
        { limit: 50, offset: 0 }
    );

    const upcomingGuests = useMemo(() => {
        return (upcoming || []).map((booking) => {
            const user = booking?.user_snapshot || {};
            const payment = booking?.payment_details || {};
            const property = booking?.property_snapshot || {};

            const guestName = user?.first_name || user?.email || "Guest";
            const email = user?.email || "—";

            return {
                // Keep a reference if you later want to fetch full profile by user_id
                booking_id: booking?.id,
                user_id: booking?.user_id,

                avatar: user?.avatar_url
                    ? user.avatar_url
                    : "/images/avatar.webp",
                guest_name: guestName,
                email,

                guests_count: booking?.guests_count ?? 0,
                checkIn: booking?.check_in_date,
                checkOut: booking?.check_out_date,

                status: payment?.payment_status
                    ? payment.payment_status
                    : "pending",
                property: property?.title || "—",

                // Optional extra fields (show if present)
                phone: user?.phone || user?.phone_number || "—",
                nationality: user?.nationality || "—",
            };
        });
    }, [upcoming]);

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState(null);

    const openProfile = (guest) => {
        setSelectedGuest(guest);
        setIsProfileOpen(true);
    };

    const closeProfile = () => {
        setIsProfileOpen(false);
        setSelectedGuest(null);
    };

    return (
        <>
            <h2 className="text-xl font-semibold">Guest Management</h2>

            {isLoading ? (
                <div className="text-sm text-gray-600 mt-4">
                    Loading guests...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingGuests.map((booking, index) => (
                        <Card
                            key={booking.booking_id ?? index}
                            className="hover:shadow-lg transition-shadow"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4 mb-4">
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src={booking.avatar} />
                                        <AvatarFallback>
                                            {safeInitials(
                                                booking.guest_name ||
                                                    booking.email
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <div className="font-semibold truncate">
                                            {booking.guest_name}
                                        </div>
                                        <div className="text-sm text-gray-600 truncate">
                                            {booking.email}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {booking.guests_count} guests
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm mb-4">
                                    <div className="flex justify-between gap-3">
                                        <span className="text-gray-600">
                                            Property:
                                        </span>
                                        <span className="font-medium text-right truncate">
                                            {booking.property}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-3">
                                        <span className="text-gray-600">
                                            Dates:
                                        </span>
                                        <span className="font-medium text-right">
                                            {formatDate(booking.checkIn)} -{" "}
                                            {formatDate(booking.checkOut)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center gap-3">
                                        <span className="text-gray-600">
                                            Status:
                                        </span>
                                        <Badge
                                            className={`text-xs ${getStatusColor(
                                                booking.status
                                            )}`}
                                        >
                                            {booking.status}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => {
                                            // hook your message action here
                                            // e.g. router.push(`/host/messages?guest=${booking.user_id}`)
                                        }}
                                    >
                                        <MessageSquare className="w-4 h-4 mr-1" />
                                        Message
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => openProfile(booking)}
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                        Profile
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Profile Popup */}
            <Dialog
                open={isProfileOpen}
                onOpenChange={(open) => (open ? null : closeProfile())}
            >
                <DialogContent className="sm:max-w-[560px]">
                    <DialogHeader>
                        <DialogTitle>Guest Profile</DialogTitle>
                        <DialogDescription>
                            Review guest details associated with the selected
                            booking.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedGuest ? (
                        <div className="space-y-5">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-14 h-14">
                                    <AvatarImage src={selectedGuest.avatar} />
                                    <AvatarFallback>
                                        {safeInitials(
                                            selectedGuest.guest_name ||
                                                selectedGuest.email
                                        )}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="min-w-0">
                                    <div className="font-semibold text-lg truncate">
                                        {selectedGuest.guest_name}
                                    </div>
                                    <div className="text-sm text-gray-600 truncate">
                                        {selectedGuest.email}
                                    </div>

                                    <div className="mt-2">
                                        <Badge
                                            className={`text-xs ${getStatusColor(
                                                selectedGuest.status
                                            )}`}
                                        >
                                            {selectedGuest.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="rounded-md border p-3">
                                    <div className="text-gray-600">
                                        Guests Count
                                    </div>
                                    <div className="font-medium">
                                        {selectedGuest.guests_count}
                                    </div>
                                </div>

                                <div className="rounded-md border p-3">
                                    <div className="text-gray-600">
                                        Property
                                    </div>
                                    <div className="font-medium truncate">
                                        {selectedGuest.property}
                                    </div>
                                </div>

                                <div className="rounded-md border p-3">
                                    <div className="text-gray-600">
                                        Check-in
                                    </div>
                                    <div className="font-medium">
                                        {formatDate(selectedGuest.checkIn)}
                                    </div>
                                </div>

                                <div className="rounded-md border p-3">
                                    <div className="text-gray-600">
                                        Check-out
                                    </div>
                                    <div className="font-medium">
                                        {formatDate(selectedGuest.checkOut)}
                                    </div>
                                </div>

                                <div className="rounded-md border p-3">
                                    <div className="text-gray-600">Phone</div>
                                    <div className="font-medium">
                                        {selectedGuest.phone}
                                    </div>
                                </div>

                                <div className="rounded-md border p-3">
                                    <div className="text-gray-600">
                                        Nationality
                                    </div>
                                    <div className="font-medium">
                                        {selectedGuest.nationality}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    className="flex-1"
                                    onClick={() => {
                                        // hook message action here
                                        // e.g. router.push(`/host/messages?guest=${selectedGuest.user_id}`)
                                        closeProfile();
                                    }}
                                >
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Message Guest
                                </Button>

                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={closeProfile}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-600">
                            No guest selected.
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default TabMyGuests;
