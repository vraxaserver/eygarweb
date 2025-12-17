"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    ChevronLeft,
    Star,
    Lock,
    CreditCard,
    Bitcoin,
    Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useGetPropertyByIdQuery } from "@/store/features/propertiesApi";
import { useSelector, useDispatch } from "react-redux";
import {
    selectIsAuthenticated,
    selectStripeCustomerId,
} from "@/store/slices/authSlice";
import {
    selectBooking,
    selectBookingDates,
    selectBookingGuests,
    setBookingDates,
    setPropertyId,
} from "@/store/slices/bookingSlice";
import CheckoutClient from "@/app/payment/checkout/CheckoutClient";

// Helper to safely parse dates
const parseDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString);
};

import { stripe, getCustomer } from "@/lib/stripe";

export default function ReservePage({ params }) {
    const { id } = React.use(params);
    const router = useRouter();
    const dispatch = useDispatch();

    const stripe_customer_id = useSelector(selectStripeCustomerId);
    const booking = useSelector(selectBooking);
    console.log("booking: (@reserve)", booking);

    // 1. Fetch Property Data
    const { data: property, isLoading, isError } = useGetPropertyByIdQuery(id);

    // 2. Get Booking State from Redux
    const { checkInDate: checkIn, checkOutDate: checkOut } =
        useSelector(selectBookingDates);
    const guests = useSelector(selectBookingGuests);

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedMethod, setSelectedMethod] = useState("saved_1");

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const paymentMethods = await stripe.paymentMethods.list({
                    customer: stripe_customer_id,
                    type: "card",
                });
                console.log("paymentMethods:", paymentMethods);
            } catch (error) {
                console.error("Failed to fetch paymentMethods:", error);
            }
        };

        fetchPaymentMethods();
    }, []);

    // 3. Calculation Logic (Memoized)
    const bookingDetails = useMemo(() => {
        if (!property) return null;

        // Fallback dates if Redux is empty (e.g. direct page refresh without coming from details)
        const checkInDate = parseDate(checkIn) || new Date();
        const checkOutDate =
            parseDate(checkOut) ||
            new Date(new Date().setDate(new Date().getDate() + 1));

        // Calculate nights
        const diffTime = Math.abs(checkOutDate - checkInDate);
        const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const validNights = nights > 0 ? nights : 1; // Prevent 0 division or weird display

        // Calculate Costs
        const pricePerNight = property.price_per_night;
        const subtotal = pricePerNight * validNights;
        const cleaningFee = property.cleaning_fee || 0;
        const serviceFee = property.service_fee || 0;
        const total = subtotal + cleaningFee + serviceFee;

        // Strings for display
        const dateOptions = { month: "short", day: "numeric" };
        const yearOptions = { year: "numeric" };
        const dateString = `${checkInDate.toLocaleDateString(
            "en-US",
            dateOptions
        )} – ${checkOutDate.toLocaleDateString(
            "en-US",
            dateOptions
        )}, ${checkOutDate.toLocaleDateString("en-US", yearOptions)}`;

        const totalGuests = guests.adults + guests.children;
        const guestString = `${totalGuests} guest${
            totalGuests !== 1 ? "s" : ""
        }${guests.infants > 0 ? `, ${guests.infants} infant` : ""}`;

        // dispatch(
        //     setFees({
        //         total_amount: total,
        //         subtotal: subtotal,
        //         total_stay: nights,
        //         currency: property.currency,
        //         cleaning: cleaningFee,
        //         service: serviceFee,
        //     })
        // );

        dispatch(setPropertyId(property.id));

        return {
            checkIn: checkInDate,
            checkOut: checkOutDate,
            nights: validNights,
            subtotal,
            cleaningFee,
            serviceFee,
            total,
            dateString,
            guestString,
            currency: property.currency,
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: property.currency,
                        product_data: { name: property.title },
                        unit_amount: total,
                    },
                    quantity: 1,
                },
            ],
            coverImage:
                property.images?.find((img) => img.is_cover)?.image_url ||
                property.images?.[0]?.image_url,
        };
    }, [property, checkIn, checkOut, guests]);

    // Mock functionality to change dates on this page
    // In a real app, this would open a ShadCN Dialog with the Calendar component
    const handleChangeDates = () => {
        // Example: Extending stay by 1 day to demonstrate calculation update
        if (bookingDetails) {
            const newCheckOut = new Date(bookingDetails.checkOut);
            newCheckOut.setDate(newCheckOut.getDate() + 1);

            dispatch(
                setBookingDates({
                    checkIn: bookingDetails.checkIn.toISOString(),
                    checkOut: newCheckOut.toISOString(),
                })
            );
            alert("Date extended by 1 day to demonstrate Redux update.");
        }
    };

    const handleConfirmPay = () => {
        if (!bookingDetails) return;
        alert(
            `Processing payment of ${bookingDetails.currency} ${bookingDetails.total} for ${bookingDetails.nights} nights.`
        );
    };

    if (isLoading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    if (isError || !property)
        return (
            <div className="min-h-screen flex items-center justify-center">
                Error loading property
            </div>
        );

    const checkoutData = {
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "qar",
                    product_data: { name: "T-shirt" },
                    unit_amount: 24344,
                },
                quantity: 1,
            },
        ],
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header */}
            <div className="border-b bg-white sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="-ml-4 hover:bg-transparent"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-3xl font-bold ml-4 text-gray-900">
                        Confirm and pay
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* LEFT COLUMN: Payment Steps */}
                    <div className="space-y-10">
                        {/* 1. Pay with */}
                        <section>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    1. Pay with
                                </h2>
                                {currentStep > 1 && (
                                    <Button
                                        variant="ghost"
                                        className="font-semibold underline hover:bg-transparent px-0"
                                        onClick={() => setCurrentStep(1)}
                                    >
                                        Change
                                    </Button>
                                )}
                            </div>

                            {currentStep === 1 ? (
                                <div className="space-y-6">
                                    {/* ... Saved Cards & Payment Methods Code from previous response ... */}
                                    {/* (Code hidden for brevity, assuming same as previous step) */}
                                    <div className="border rounded-xl p-4">
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="w-6 h-6" />
                                            <span>Visa •••• 4242</span>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full sm:w-[160px] bg-black text-white h-12 rounded-lg"
                                        onClick={() => setCurrentStep(2)}
                                    >
                                        Continue
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <CreditCard className="w-5 h-5" />
                                    <span>Visa •••• 4242</span>
                                </div>
                            )}
                        </section>

                        <Separator />

                        {/* 2. Review and Pay */}
                        <section>
                            <h2
                                className={`text-xl font-semibold mb-4 ${
                                    currentStep === 2
                                        ? "text-gray-900"
                                        : "text-gray-400"
                                }`}
                            >
                                2. Review and pay
                            </h2>

                            {currentStep === 2 && (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    <div className="text-xs text-gray-600 leading-relaxed">
                                        Total:{" "}
                                        <span className="font-bold text-black">
                                            {bookingDetails?.currency}{" "}
                                            {bookingDetails?.total.toLocaleString()}
                                        </span>{" "}
                                        for {bookingDetails?.nights} nights.
                                    </div>
                                    <CheckoutClient
                                        checkoutData={bookingDetails}
                                    />
                                </div>
                            )}
                        </section>
                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <div className="lg:pl-10">
                        <div className="sticky top-28 border rounded-xl p-6 shadow-sm bg-white">
                            {/* Property Header */}
                            <div className="flex gap-4 mb-6">
                                <div className="relative w-28 h-24 flex-shrink-0">
                                    <img
                                        src={bookingDetails?.coverImage}
                                        alt={property.title}
                                        className="object-cover w-full h-full rounded-lg"
                                    />
                                </div>
                                <div className="flex flex-col justify-between">
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1 capitalize">
                                            {property.place_type.replace(
                                                "_",
                                                " "
                                            )}
                                        </div>
                                        <h3 className="text-sm font-medium leading-tight text-gray-900 line-clamp-2">
                                            {property.title}
                                        </h3>
                                    </div>
                                    <div className="flex items-center text-sm mt-1">
                                        <Star className="w-3 h-3 fill-black text-black mr-1" />
                                        <span className="font-semibold">
                                            {property.average_rating > 0
                                                ? property.average_rating.toFixed(
                                                      2
                                                  )
                                                : "New"}
                                        </span>
                                        <span className="text-gray-500 ml-1">
                                            ({property.total_reviews} reviews)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-1">
                                <div className="font-semibold text-gray-900">
                                    Free cancellation
                                </div>
                                <div className="text-sm text-gray-600">
                                    Cancel before check-in for a full refund.
                                </div>
                            </div>

                            <Separator className="my-6" />

                            {/* Booking Dates & Guests */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-semibold text-gray-900">
                                            Dates
                                        </div>
                                        <div className="text-gray-600">
                                            {bookingDetails?.dateString}
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleChangeDates}
                                        className="font-semibold underline hover:text-gray-600 text-sm"
                                    >
                                        Change
                                    </button>
                                </div>

                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-semibold text-gray-900">
                                            Guests
                                        </div>
                                        <div className="text-gray-600">
                                            {bookingDetails?.guestString}
                                        </div>
                                    </div>
                                    <button className="font-semibold underline hover:text-gray-600 text-sm">
                                        Change
                                    </button>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            {/* Price Breakdown */}
                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-600">
                                    <div className="underline">
                                        Price details
                                    </div>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <div>
                                        {bookingDetails?.currency}{" "}
                                        {property.price_per_night.toLocaleString()}{" "}
                                        x {bookingDetails?.nights} night
                                        {bookingDetails?.nights !== 1
                                            ? "s"
                                            : ""}
                                    </div>
                                    <div>
                                        {bookingDetails?.currency}{" "}
                                        {bookingDetails?.subtotal.toLocaleString()}
                                    </div>
                                </div>

                                {bookingDetails?.cleaningFee > 0 && (
                                    <div className="flex justify-between text-gray-600">
                                        <div className="underline">
                                            Cleaning fee
                                        </div>
                                        <div>
                                            {bookingDetails?.currency}{" "}
                                            {bookingDetails.cleaningFee.toLocaleString()}
                                        </div>
                                    </div>
                                )}
                                {bookingDetails?.serviceFee > 0 && (
                                    <div className="flex justify-between text-gray-600">
                                        <div className="underline">
                                            Service fee
                                        </div>
                                        <div>
                                            {bookingDetails?.currency}{" "}
                                            {bookingDetails.serviceFee.toLocaleString()}
                                        </div>
                                    </div>
                                )}

                                <Separator className="my-2" />

                                <div className="flex justify-between font-semibold text-base text-gray-900">
                                    <div className="underline">
                                        Total{" "}
                                        <span className="underline">
                                            {bookingDetails?.currency}
                                        </span>
                                    </div>
                                    <div>
                                        {bookingDetails?.currency}{" "}
                                        {bookingDetails?.total.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
