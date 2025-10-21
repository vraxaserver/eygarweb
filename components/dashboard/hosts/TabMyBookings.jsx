import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {getStatusColor} from "@/lib/utils"
import {
    Eye,
    MessageSquare,
    Clock,
    CheckCircle,
} from "lucide-react";

const TabMyBookings = ({ongoingBookings, upcomingBookings}) => {
    const getStatusIcon = (status) => {
        switch (status) {
            case "confirmed":
                return <CheckCircle className="w-4 h-4" />;
            case "pending":
                return <Clock className="w-4 h-4" />;
            case "checked-in":
                return <CheckCircle className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
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
                    {ongoingBookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="border border-gray-200 rounded-lg p-4"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={booking.avatar} />
                                        <AvatarFallback>
                                            {booking.guest[0]}
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
                                    className={getStatusColor(booking.status)}
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
                                    <div className="text-gray-600">Guests</div>
                                    <div className="font-medium">
                                        {booking.guests} guests
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-600">Total</div>
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
                    ))}
                </CardContent>
            </Card>

            {/* Upcoming Bookings */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-blue-600" />
                        Upcoming Bookings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {upcomingBookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="border border-gray-200 rounded-lg p-4"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={booking.avatar} />
                                        <AvatarFallback>
                                            {booking.guest[0]}
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
                                    className={getStatusColor(booking.status)}
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
                                    <div className="text-gray-600">Guests</div>
                                    <div className="font-medium">
                                        {booking.guests} guests
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-600">Total</div>
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
                                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                                >
                                    Approve
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

export default TabMyBookings;
