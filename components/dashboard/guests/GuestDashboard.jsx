import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingCard } from "@/components/dashboard/guests/BookingCard";
import { BookingDetail } from "@/components/dashboard/guests/BookingDetails";
import { Calendar, History, User } from "lucide-react";
import { useListBookingsQuery } from "@/store/features/bookingApi";

function asDate(value) {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
}

function getBookingId(b) {
    return b?.id ?? b?._id ?? b?.booking_id ?? null;
}

function getPropertyTitle(b) {
    // Prefer what your backend actually stores (you showed property_snapshot)
    return (
        b?.property_snapshot?.title ??
        b?.property_snapshot?.name ??
        b?.property?.name ??
        "Property"
    );
}

export default function GuestDashboard() {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    // RTK Query standard shape
    const {
        data: bookingsRaw,
        isLoading,
        isError,
        error,
        refetch,
    } = useListBookingsQuery();

    // Always normalize to array
    const bookings = useMemo(() => {
        if (!bookingsRaw) return [];
        // If API returns { items: [] } adjust here
        if (Array.isArray(bookingsRaw)) return bookingsRaw;
        if (Array.isArray(bookingsRaw.items)) return bookingsRaw.items;
        return [];
    }, [bookingsRaw]);

    const now = useMemo(() => new Date(), []);

    const { upcomingBookings, pastBookings, activeBooking } = useMemo(() => {
        const upcoming = [];
        const past = [];
        let active = null;

        for (const b of bookings) {
            const checkIn = asDate(b.check_in_date);
            const checkOut = asDate(b.check_out_date);

            // If any date is invalid, skip classification but still allow showing somewhere if you want
            if (!checkIn || !checkOut) continue;

            // Active: now >= checkIn AND now < checkOut (exclusive checkout is common)
            if (now >= checkIn && now < checkOut && !active) {
                active = b;
                continue;
            }

            if (checkIn > now) upcoming.push(b);
            else if (checkOut <= now) past.push(b);
        }

        // Optional: sort lists
        upcoming.sort(
            (a, b) => new Date(a.check_in_date) - new Date(b.check_in_date)
        );
        past.sort(
            (a, b) => new Date(b.check_out_date) - new Date(a.check_out_date)
        );

        return {
            upcomingBookings: upcoming,
            pastBookings: past,
            activeBooking: active,
        };
    }, [bookings, now]);

    const handleBookingClick = (booking) => {
        setSelectedBooking(booking);
        setShowDetail(true);
    };

    const handleBackToDashboard = () => {
        setShowDetail(false);
        setSelectedBooking(null);
    };

    if (showDetail && selectedBooking) {
        return (
            <BookingDetail
                booking={selectedBooking}
                onBack={handleBackToDashboard}
            />
        );
    }

    if (isLoading) {
        return <h1>Loading....</h1>;
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white border rounded-lg p-6 max-w-lg w-full">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        Failed to load bookings
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                        {typeof error === "string"
                            ? error
                            : error?.data?.message ||
                              error?.error ||
                              "Unknown error"}
                    </p>
                    <button
                        className="px-4 py-2 rounded-md bg-gray-900 text-white"
                        onClick={() => refetch()}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <div className="bg-pink-600 rounded-lg p-2">
                                <User className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">
                                    Guest Dashboard
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Welcome back
                                </p>
                            </div>
                        </div>

                        {/* Optional refresh */}
                        <button
                            className="text-sm px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50"
                            onClick={() => refetch()}
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs
                    defaultValue={activeBooking ? "active" : "upcoming"}
                    className="w-full"
                >
                    <TabsList
                        className={`grid w-full ${
                            activeBooking ? "grid-cols-3" : "grid-cols-2"
                        } mb-8`}
                    >
                        {activeBooking && (
                            <TabsTrigger
                                value="active"
                                className="flex items-center space-x-2"
                            >
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span>Active Booking</span>
                            </TabsTrigger>
                        )}
                        <TabsTrigger
                            value="upcoming"
                            className="flex items-center space-x-2"
                        >
                            <Calendar className="h-4 w-4" />
                            <span>Upcoming Bookings</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="history"
                            className="flex items-center space-x-2"
                        >
                            <History className="h-4 w-4" />
                            <span>Booking History</span>
                        </TabsTrigger>
                    </TabsList>

                    {activeBooking && (
                        <TabsContent value="active" className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Current Stay
                                </h2>
                                <Badge className="bg-green-500 hover:bg-green-600 text-white">
                                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                                    Checked In
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 max-w-md">
                                <BookingCard
                                    booking={activeBooking}
                                    onClick={() =>
                                        handleBookingClick(activeBooking)
                                    }
                                    isActive={true}
                                />
                            </div>

                            <Card className="bg-green-50 border-green-200">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-green-500 rounded-full p-2">
                                            <Calendar className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-green-800">
                                                Enjoy Your Stay!
                                            </h3>
                                            <p className="text-green-700 text-sm">
                                                You're currently checked in at{" "}
                                                {getPropertyTitle(
                                                    activeBooking
                                                )}
                                                . Need assistance? Contact your
                                                host directly.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    )}

                    <TabsContent value="upcoming" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Upcoming Trips
                            </h2>
                            <p className="text-gray-500">
                                {upcomingBookings.length} booking(s)
                            </p>
                        </div>

                        {upcomingBookings.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No upcoming bookings
                                </h3>
                                <p className="text-gray-500">
                                    Your next adventure awaits!
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {upcomingBookings.map((booking) => (
                                    <BookingCard
                                        key={
                                            getBookingId(booking) ??
                                            `${booking.property_id}-${booking.check_in_date}`
                                        }
                                        booking={booking}
                                        onClick={() =>
                                            handleBookingClick(booking)
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="history" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Booking History
                            </h2>
                            <p className="text-gray-500">
                                {pastBookings.length} booking(s)
                            </p>
                        </div>

                        {pastBookings.length === 0 ? (
                            <div className="text-center py-12">
                                <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No booking history
                                </h3>
                                <p className="text-gray-500">
                                    Your travel memories will appear here
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pastBookings.map((booking) => (
                                    <BookingCard
                                        key={
                                            getBookingId(booking) ??
                                            `${booking.property_id}-${booking.check_out_date}`
                                        }
                                        booking={booking}
                                        onClick={() =>
                                            handleBookingClick(booking)
                                        }
                                        isPast={true}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
