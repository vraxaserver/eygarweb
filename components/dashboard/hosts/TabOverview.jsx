import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {getStatusColor} from "@/lib/utils"
import {
    Calendar,
    Plus,
    MessageSquare,
    BarChart3
} from "lucide-react";
const TabOverview = ({upcomingBookings, setShowAddModal}) => {
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
                                        {booking.guest[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate">
                                        {booking.guest}
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
                <Card >
                    <CardHeader>
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Button onClick={setShowAddModal} className="h-20 flex-col space-y-2 bg-[#7a3d8a] hover:bg-purple-800">
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
                            className="h-20 flex-col space-y-2"
                        >
                            <MessageSquare className="w-6 h-6" />
                            <span className="text-sm">Message Guests</span>
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
        </>
    );
};

export default TabOverview;
