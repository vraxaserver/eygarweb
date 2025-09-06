import { Calendar, MapPin, Star, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

    const isUpcoming = new Date(booking.checkIn) > new Date();
    const isActive =
        new Date() >= new Date(booking.checkIn) &&
        new Date() <= new Date(booking.checkOut);

    return (
        <Card
            className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden"
            onClick={onClick}
        >
            <div className="relative">
                <img
                    src={booking.property.image}
                    alt={booking.property.name}
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
                            {booking.property.name}
                        </h3>
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {booking.property.location}
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(booking.checkIn)} -{" "}
                            {formatDate(booking.checkOut)}
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            {getDaysBetween(
                                booking.checkIn,
                                booking.checkOut
                            )}{" "}
                            nights
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm font-medium">
                                {booking.property.rating}
                            </span>
                            <span className="text-gray-500 text-sm ml-1">
                                ({booking.property.reviews} reviews)
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                                ${booking.totalPrice}
                            </p>
                            <p className="text-xs text-gray-500">total</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
