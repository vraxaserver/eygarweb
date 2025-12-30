import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";
import {
    Eye,
    MessageSquare,
    Clock,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import {
    useHostApproveBookingMutation,
    useListHostUpcomingBookingsQuery,
} from "@/store/features/bookingApi";

const TabMyBookings = ({ ongoingBookings = [] }) => {
    const { data: upcoming = [], isLoading } = useListHostUpcomingBookingsQuery(
        { limit: 50, offset: 0 }
    );

    const [hostApprove, { isLoading: approving }] =
        useHostApproveBookingMutation();

    const getStatusIcon = (status) => {
        switch (status) {
            case "confirmed":
            case "booking_confirmed":
            case "host_approved":
                return <CheckCircle className="w-4 h-4" />;
            case "pending_payment":
            case "payment_confirmed":
                return <Clock className="w-4 h-4" />;
            case "checked_in":
                return <CheckCircle className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    const formatMoney = (amount, currency) => {
        if (amount == null) return "-";
        // If your DB stores major units as numbers (e.g., 494.2), render directly.
        // If you later switch to minor units (e.g., 49420), update this accordingly.
        return `${Number(amount).toFixed(2)} ${String(
            currency || ""
        ).toUpperCase()}`;
    };

    const onApprove = async (bookingId) => {
        try {
            await hostApprove({ bookingId }).unwrap();
        } catch (e) {
            // optional: toast here
            console.error(e);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ongoing Bookings */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                        Ongoing Bookings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {ongoingBookings?.length ? (
                        ongoingBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="border border-gray-200 rounded-lg p-4"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={booking.avatar} />
                                            <AvatarFallback>
                                                {booking.guest?.[0] || "G"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">
                                                {booking.guest}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {booking.property}
                                            </div>
                                        </div>
                                    </div>
                                    <Badge
                                        className={getStatusColor(
                                            booking.status
                                        )}
                                    >
                                        {getStatusIcon(booking.status)}
                                        <span className="ml-1">
                                            {booking.status}
                                        </span>
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <div className="text-gray-600">
                                            Check-in
                                        </div>
                                        <div className="font-medium">
                                            {new Date(
                                                booking.checkIn
                                            ).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-600">
                                            Check-out
                                        </div>
                                        <div className="font-medium">
                                            {new Date(
                                                booking.checkOut
                                            ).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-600">
                                            Guests
                                        </div>
                                        <div className="font-medium">
                                            {booking.guests} guests
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-600">
                                            Total
                                        </div>
                                        <div className="font-medium">
                                            {booking.total}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-2 mt-4">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        <MessageSquare className="w-4 h-4 mr-1" />
                                        Message
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-gray-600">
                            No ongoing bookings.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Upcoming Bookings (HOST) */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-blue-600" />
                        Upcoming Bookings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading ? (
                        <div className="text-sm text-gray-600">Loading...</div>
                    ) : upcoming?.length ? (
                        upcoming.map((booking) => {
                            const guestName =
                                booking?.user_snapshot?.first_name ||
                                booking?.user_snapshot?.email ||
                                "Guest";

                            const guestAvatar =
                                booking?.user_snapshot?.avatar_url;

                            const propertyTitle =
                                booking?.property_snapshot?.title || "Property";

                            const status = booking?.booking_status || "unknown";

                            return (
                                <div
                                    key={booking._id}
                                    className="border border-gray-200 rounded-lg p-4"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="w-10 h-10">
                                                <AvatarImage
                                                    src={guestAvatar || ""}
                                                />
                                                <AvatarFallback>
                                                    {String(guestName)[0] ||
                                                        "G"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">
                                                    {guestName}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {propertyTitle}
                                                </div>
                                            </div>
                                        </div>

                                        <Badge
                                            className={getStatusColor(status)}
                                        >
                                            {getStatusIcon(status)}
                                            <span className="ml-1">
                                                {status}
                                            </span>
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <div className="text-gray-600">
                                                Check-in
                                            </div>
                                            <div className="font-medium">
                                                {new Date(
                                                    booking.check_in_date
                                                ).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-600">
                                                Check-out
                                            </div>
                                            <div className="font-medium">
                                                {new Date(
                                                    booking.check_out_date
                                                ).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-600">
                                                Guests
                                            </div>
                                            <div className="font-medium">
                                                {booking.guests_count} guests
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-600">
                                                Total
                                            </div>
                                            <div className="font-medium">
                                                {formatMoney(
                                                    booking.total_amount,
                                                    booking.currency
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2 mt-4">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            <MessageSquare className="w-4 h-4 mr-1" />
                                            Message
                                        </Button>

                                        <Button
                                            size="sm"
                                            className="flex-1 bg-[#7a3d8a] hover:bg-purple-800"
                                            disabled={
                                                approving ||
                                                status === "host_approved"
                                            }
                                            onClick={() =>
                                                onApprove(booking._id)
                                            }
                                        >
                                            {status === "host_approved"
                                                ? "Approved"
                                                : approving
                                                ? "Approving..."
                                                : "Approve"}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-sm text-gray-600">
                            No upcoming bookings.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default TabMyBookings;
