import React from "react";
import Icon from "@/components/AppIcon";

const BookingWidget = ({ bookings = [] }) => {
    return (
        <div className="bg-card border border-border rounded-lg shadow-elevation-1">
            <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">
                    Bookings
                </h3>
            </div>
            <div className="p-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-foreground">
                            Upcoming Bookings
                        </h4>
                        <span className="text-sm text-muted-foreground">
                            {bookings?.length} total
                        </span>
                    </div>

                    {bookings?.length > 0 ? (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {bookings?.slice(0, 5)?.map((booking, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-accent/10 text-accent rounded-lg flex items-center justify-center">
                                            <Icon name="Calendar" size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {booking?.service}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {booking?.date} at{" "}
                                                {booking?.time}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-foreground">
                                            {booking?.guests} guests
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {booking?.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Icon
                                name="Calendar"
                                size={32}
                                className="mx-auto mb-3 text-muted-foreground opacity-50"
                            />
                            <p className="text-sm text-muted-foreground">
                                No upcoming bookings
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Bookings will appear here when guests make
                                reservations
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingWidget;
