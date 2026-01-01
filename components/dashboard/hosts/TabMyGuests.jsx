import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";
import { Eye, MessageSquare } from "lucide-react";

import {
    useHostApproveBookingMutation,
    useListHostUpcomingBookingsQuery,
} from "@/store/features/bookingApi";

const TabMyGuests = ({ upcomingBookings, ongoingBookings }) => {
    const { data: upcoming = [], isLoading } = useListHostUpcomingBookingsQuery(
        { limit: 50, offset: 0 }
    );

    console.log("upcoming: ", upcoming);
    const upcomingGuests = upcoming.map((booking) => {
        const bookingGuest = {
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

    // const ongoingBookings2 = upcoming.filter(
    //     (booking) => booking.checkout_status === "checked_in"
    // );

    // const ongoingBookings3 = upcoming.filter(
    //     (booking) => booking.checkout_status === "checked_in"
    // );

    return (
        <>
            <h2 className="text-xl font-semibold">Guest Management</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingGuests.map((booking, index) => (
                    <Card
                        key={index}
                        className="hover:shadow-lg transition-shadow"
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4 mb-4">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={booking.avatar} />
                                    <AvatarFallback>
                                        {booking.guest}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-semibold">
                                        {booking.guest_name}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {booking.guests_count} guests
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Property:
                                    </span>
                                    <span className="font-medium pl-1">
                                        {booking.property}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Dates:
                                    </span>
                                    <span className="font-medium">
                                        {new Date(
                                            booking.checkIn
                                        ).toLocaleDateString()}{" "}
                                        -{" "}
                                        {new Date(
                                            booking.checkOut
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
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
                                    Profile
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
};

export default TabMyGuests;
