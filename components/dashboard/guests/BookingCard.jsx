import { Eye, QrCode, LogIn, MapPin, Calendar } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBookingState } from "@/lib/bookingUtils";
import clsx from "clsx";

export function BookingCard({ booking, onView, onShowQr, onCheckin }) {
    const state = getBookingState(booking);

    const bgClass = clsx({
        "bg-green-50 border-green-300": state === "active_checked_in",
        "bg-yellow-50 border-yellow-400": state === "needs_checkin",
        "bg-white": state === "upcoming" || state === "history",
    });

    return (
        <Card
            className={`overflow-hidden transition hover:shadow-lg ${bgClass} pt-0`}
        >
            <div className="relative h-44">
                <Image
                    src={
                        booking.property_snapshot?.images?.[0]?.image_url ||
                        "/images/placeholders/property-placeholder.jpg"
                    }
                    alt={booking.property_snapshot?.title || "Property"}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="p-4 space-y-3">
                <h3 className="font-semibold text-lg truncate">
                    {booking.property_snapshot?.title}
                </h3>

                <div className="text-sm text-gray-600 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {booking.property_snapshot?.location?.city},{" "}
                    {booking.property_snapshot?.location?.country}
                </div>

                <div className="text-sm flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(
                        booking.check_in_date
                    ).toLocaleDateString()} →{" "}
                    {new Date(booking.check_out_date).toLocaleDateString()}
                </div>

                <div className="flex justify-between pt-3 gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={onView}
                    >
                        <Eye className="w-4 h-4 mr-1" /> View
                    </Button>

                    <Button size="sm" variant="outline" onClick={onShowQr}>
                        <QrCode className="w-4 h-4" />
                    </Button>

                    {state === "needs_checkin" && (
                        <Button
                            size="sm"
                            className="bg-yellow-600 hover:bg-yellow-700 text-white"
                            onClick={onCheckin}
                        >
                            <LogIn className="w-4 h-4 mr-1" />
                            Check-in
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}
