import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";
import { Calendar, Plus, MessageSquare, BarChart3 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useListHostUpcomingBookingsQuery } from "@/store/features/bookingApi";

const TabOverview = ({ setShowAddModal }) => {
    const { data: upcoming = [], isLoading } = useListHostUpcomingBookingsQuery(
        { limit: 50, offset: 0 }
    );

    const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
    const [customMessage, setCustomMessage] = useState(
        "Hello {guest_name}, welcome to {property}! Hope you are having a wonderful stay. Let us know if you need anything!"
    );
    const [guestPhones, setGuestPhones] = useState({});

    const upcomingBookings = upcoming.map((booking) => {
        const bookingGuest = {
            id: booking._id || booking.id,
            avatar: booking?.user_snapshot?.avatar_url
                ? booking?.user_snapshot?.avatar_url
                : "/images/avatar.webp",
            guest_name: booking?.user_snapshot?.first_name
                ? booking?.user_snapshot?.first_name
                : booking?.user_snapshot?.email,
            guests_count: booking.guests_count,
            checkIn: booking.check_in_date,
            checkOut: booking.check_out_date,
            status: booking?.payment_details?.payment_status
                ? booking?.payment_details?.payment_status
                : "pending",
            property: booking.property_snapshot?.title,
        };

        return bookingGuest;
    });

    const activeGuestBookings = React.useMemo(() => {
        const checkedIn = upcoming.filter(
            (b) => b.checkout_status === "checked_in" || b.status === "checked_in"
        );
        if (checkedIn.length > 0) return checkedIn;
        return upcoming.filter(
            (b) =>
                b.status === "confirmed" ||
                b.status === "active" ||
                b.checkout_status === "not_checked_in"
        );
    }, [upcoming]);

    const getGuestPhone = (b) => {
        const id = b._id || b.id;
        if (guestPhones[id] !== undefined) return guestPhones[id];
        return (
            b.user_snapshot?.phone_number ||
            b.user_snapshot?.mobile ||
            b.phone_number ||
            ""
        );
    };

    const handleWhatsAppSingle = (b) => {
        const guestName =
            b.user_snapshot?.first_name || b.user_snapshot?.email || "Guest";
        const propTitle = b.property_snapshot?.title || "our property";
        const phone = getGuestPhone(b).replace(/[^\d+]/g, "").replace(/^\+/, "");
        const msg = customMessage
            .replace("{guest_name}", guestName)
            .replace("{property}", propTitle);
        const url = phone
            ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
            : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
        window.open(url, "_blank");
    };

    const handleWhatsAppAll = () => {
        activeGuestBookings.forEach((b, i) => {
            setTimeout(() => {
                handleWhatsAppSingle(b);
            }, i * 400);
        });
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">
                            Recent Bookings
                        </CardTitle>
                        <Button variant="outline" size="sm">
                            View All
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {upcomingBookings.slice(0, 3).map((booking) => (
                            <div
                                key={booking.id}
                                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                            >
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={booking.avatar} />
                                    <AvatarFallback>
                                        {booking.guest_name}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate">
                                        {booking.guest_name}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {booking.property}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {new Date(
                                            booking.checkIn
                                        ).toLocaleDateString()}{" "}
                                        -{" "}
                                        {new Date(
                                            booking.checkOut
                                        ).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold text-sm">
                                        {booking.total}
                                    </div>
                                    <Badge
                                        className={`text-xs ${getStatusColor(
                                            booking.status
                                        )}`}
                                    >
                                        {booking.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Button
                            onClick={setShowAddModal}
                            className="h-20 flex-col space-y-2 bg-[#7a3d8a] hover:bg-purple-800"
                        >
                            <Plus className="w-6 h-6" />
                            <span className="text-sm">Add Property</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex-col space-y-2"
                        >
                            <Calendar className="w-6 h-6" />
                            <span className="text-sm">Manage Calendar</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex-col space-y-2 border-green-200 hover:border-green-400 hover:bg-green-50/50"
                            onClick={() => setShowWhatsAppModal(true)}
                        >
                            <MessageSquare className="w-6 h-6 text-green-600" />
                            <span className="text-sm font-medium">Message Guests</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex-col space-y-2"
                        >
                            <BarChart3 className="w-6 h-6" />
                            <span className="text-sm">View Analytics</span>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Chart Placeholder */}
            <Card className="mt-5">
                <CardHeader>
                    <CardTitle className="text-lg">Earnings Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-600">
                                Earnings chart will be displayed here
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* WhatsApp Active Guests Modal */}
            <Dialog open={showWhatsAppModal} onOpenChange={setShowWhatsAppModal}>
                <DialogContent className="max-w-xl bg-white p-6 rounded-xl shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2 text-gray-900">
                            <MessageSquare className="w-6 h-6 text-green-600" />
                            WhatsApp Active Guests
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 mt-2">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                                Broadcast Message Template
                            </label>
                            <textarea
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                                rows={3}
                                className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="Message to send to guests..."
                            />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <span className="text-sm font-semibold text-gray-800">
                                Active Guests ({activeGuestBookings.length})
                            </span>
                            {activeGuestBookings.length > 0 && (
                                <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
                                    onClick={handleWhatsAppAll}
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    WhatsApp All ({activeGuestBookings.length})
                                </Button>
                            )}
                        </div>

                        <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                            {activeGuestBookings.length === 0 ? (
                                <div className="text-center py-6 text-sm text-gray-500 bg-gray-50 rounded-lg">
                                    No active guests currently found.
                                </div>
                            ) : (
                                activeGuestBookings.map((b) => {
                                    const id = b._id || b.id;
                                    const name =
                                        b.user_snapshot?.first_name ||
                                        b.user_snapshot?.email ||
                                        "Guest";
                                    const phone = getGuestPhone(b);
                                    const property =
                                        b.property_snapshot?.title || "Property";

                                    return (
                                        <div
                                            key={id}
                                            className="p-3 border rounded-lg bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <div className="font-semibold text-sm text-gray-900 truncate">
                                                    {name}
                                                </div>
                                                <div className="text-xs text-gray-600 truncate">
                                                    {property}
                                                </div>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={phone}
                                                        onChange={(e) =>
                                                            setGuestPhones((prev) => ({
                                                                ...prev,
                                                                [id]: e.target
                                                                    .value,
                                                            }))
                                                        }
                                                        placeholder="WhatsApp Phone (+123...)"
                                                        className="text-xs px-2 py-1 border border-gray-300 rounded w-44 bg-white"
                                                    />
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700 text-white text-xs shrink-0"
                                                onClick={() =>
                                                    handleWhatsAppSingle(b)
                                                }
                                            >
                                                <MessageSquare className="w-3.5 h-3.5 mr-1" />
                                                WhatsApp
                                            </Button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default TabOverview;
