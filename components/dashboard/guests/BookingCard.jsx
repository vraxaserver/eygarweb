import { Calendar, MapPin, Star, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export function BookingCard({ booking, onClick, isPast = false }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getDaysBetween = (checkIn, checkOut) => {
        const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const formatLocation = (loc) => {
        if (!loc) return "";
        if (typeof loc === "string") return loc;

        const parts = [loc.address, loc.city, loc.state, loc.country].filter(
            Boolean
        );
        return parts.join(", ");
    };

    const isUpcoming = new Date(booking.check_in_date) > new Date();
    const isActive =
        new Date() >= new Date(booking.check_in_date) &&
        new Date() <= new Date(booking.check_out_date);

    return (
        <Card
            className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden"
            onClick={onClick}
        >
            <div className="relative">
                <Image
                    src={
                        booking?.property_snapshot?.image ||
                        "/images/placeholders/property-placeholder.jpg"
                    }
                    alt={booking?.property_snapshot?.title || "Property image"}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                    {isActive && (
                        <Badge className="bg-green-500 hover:bg-green-600">
                            Active
                        </Badge>
                    )}
                    {isUpcoming && !isActive && (
                        <Badge className="bg-blue-500 hover:bg-blue-600">
                            Upcoming
                        </Badge>
                    )}
                    {isPast && <Badge variant="secondary">Completed</Badge>}
                </div>
            </div>

            <CardContent className="p-4">
                <div className="space-y-3">
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                            {booking.property_snapshot.title}
                        </h3>
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {formatLocation(
                                booking?.property_snapshot?.location
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(booking.check_in_date)} -{" "}
                            {formatDate(booking.check_out_date)}
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            {getDaysBetween(
                                booking.check_in_date,
                                booking.check_out_date
                            )}{" "}
                            nights
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm font-medium">
                                {booking.property_snapshot?.rating}
                            </span>
                            <span className="text-gray-500 text-sm ml-1">
                                ({booking.property_snapshot?.reviews} reviews)
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                                ${booking.total_amount}
                            </p>
                            <p className="text-xs text-gray-500">total</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
