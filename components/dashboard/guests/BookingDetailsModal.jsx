import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { isWithinCheckInWindow } from "@/lib/bookingUtils";

export function BookingDetailsModal({
    booking,
    open,
    onClose,
    onCheckin,
    onCancel,
}) {
    if (!booking) return null;
    const canCheckIn = isWithinCheckInWindow(booking);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{booking.property_snapshot.title}</DialogTitle>
                </DialogHeader>

                {/* Slideshow */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {booking.property_snapshot.images.map((img) => (
                        <Image
                            key={img.id}
                            src={img.image_url}
                            alt=""
                            width={600}
                            height={400}
                            className="rounded-lg object-cover"
                        />
                    ))}
                </div>

                {/* Host Info */}
                <div className="mt-4 text-sm">
                    <p className="font-semibold">Host</p>
                    <p>{booking.property_snapshot.host_name}</p>
                    <p>{booking.property_snapshot.host_email}</p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                    {booking?.checkout_status !== "checked_in" && (
                        <Button onClick={onCheckin} disabled={!canCheckIn} title={!canCheckIn ? "Check-in is only available between check-in and check-out dates." : ""}>
                            Check-in
                        </Button>
                    )}
                    <Button variant="destructive" onClick={onCancel}>
                        Cancel Booking
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
