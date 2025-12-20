"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, CreditCard, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useGetPropertyByIdQuery } from "@/store/features/propertiesApi";
import { useSelector } from "react-redux";
import { selectStripeCustomerId } from "@/store/slices/authSlice";
import {
    selectBookingDates,
    selectBookingFees,
    selectBookingGuests,
} from "@/store/slices/bookingSlice";

import {
    useGetPaymentMethodsQuery,
    useAddPaymentMethodMutation,
    useMakePaymentMutation,
} from "@/store/features/stripeApi";

// ---------------------------
// Helpers
// ---------------------------
const parseDate = (dateString) => {
    if (!dateString) return null;
    const d = new Date(dateString);
    return Number.isNaN(d.getTime()) ? null : d;
};

const formatDateRange = (checkInDate, checkOutDate) => {
    if (
        !(checkInDate instanceof Date) ||
        !(checkOutDate instanceof Date) ||
        isNaN(checkInDate.getTime()) ||
        isNaN(checkOutDate.getTime())
    ) {
        return null;
    }

    const dateOptions = { month: "short", day: "numeric" };
    const yearOptions = { year: "numeric" };

    return `${checkInDate.toLocaleDateString(
        "en-US",
        dateOptions
    )} – ${checkOutDate.toLocaleDateString(
        "en-US",
        dateOptions
    )}, ${checkOutDate.toLocaleDateString("en-US", yearOptions)}`;
};

const buildGuestString = (guests) => {
    const totalGuests = (guests?.adults || 0) + (guests?.children || 0);
    const infants = guests?.infants || 0;

    return `${totalGuests} guest${totalGuests !== 1 ? "s" : ""}${
        infants > 0 ? `, ${infants} infant${infants !== 1 ? "s" : ""}` : ""
    }`;
};

const toMinorUnits = (amountMajor) => {
    // Stripe Checkout expects smallest unit (e.g., QAR => *100)
    const n = Number(amountMajor || 0);
    return Math.round(n * 100);
};

export default function ReservePage({ params }) {
    // For compatibility with your current setup, keep it direct:
    const { id } = React.use(params);

    const router = useRouter();

    const stripeCustomerId = useSelector(selectStripeCustomerId);
    const { checkInDate, checkOutDate } = useSelector(selectBookingDates);
    const guests = useSelector(selectBookingGuests);
    const fees = useSelector(selectBookingFees);

    const { data: property, isLoading, isError } = useGetPropertyByIdQuery(id);

    // Flow state
    const [currentStep, setCurrentStep] = useState(1); // 1 Review -> 2 Payment method -> 3 Pay
    const [bookingId, setBookingId] = useState(null);

    // Store a snapshot of the selected payment method so Step 2 summary works reliably
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    const [confirmingBooking, setConfirmingBooking] = useState(false);

    // Stripe RTK
    const [addPaymentMethod, { isLoading: addingPaymentMethod }] =
        useAddPaymentMethodMutation();
    const [makePayment, { isLoading: creatingPayment }] =
        useMakePaymentMutation();

    const bookingDetails = useMemo(() => {
        if (!property) return null;

        // const checkInDate = parseDate(checkIn) || new Date();
        // const checkOutDate =
        //     parseDate(checkOut) ||
        //     new Date(new Date().setDate(new Date().getDate() + 1));

        // const diffTime = Math.abs(checkOutDate - checkInDate);
        const nights = fees.nights;
        const validNights = nights > 0 ? nights : 1;

        const pricePerNight = fees.price_per_night;
        const subtotal = fees.subtotal;

        const cleaningFee = fees.cleaning_fee || 0;
        const serviceFee = fees.service_fee || 0;

        const total = fees.total_amount;
        const currency = fees.currency;
        const description = `Booking payment - ${property.title}`;
        const line_items = [
            {
                price_data: {
                    currency: currency || "qar",
                    product_data: {
                        id: property.id,
                        name: description || "Booking payment",
                    },
                    unit_amount: total,
                },
                quantity: 1,
            },
        ];

        return {
            propertyId: property.id,
            propertyTitle: property.title,
            currency: currency,

            checkIn: checkInDate,
            checkOut: checkOutDate,
            nights: validNights,
            dateString: formatDateRange(checkInDate, checkOutDate),

            guests,
            guestString: buildGuestString(guests),

            pricePerNight,
            subtotal,
            cleaningFee,
            serviceFee,
            total,
            line_items,

            coverImage:
                property.images?.find((img) => img.is_cover)?.image_url ||
                property.images?.[0]?.image_url,
        };
    }, [property, checkInDate, checkOutDate, guests]);

    const {
        data: paymentMethodsData,
        isLoading: paymentMethodsLoading,
        isError: paymentMethodsIsError,
        error: paymentMethodsError,
        refetch: refetchPaymentMethods,
    } = useGetPaymentMethodsQuery(
        { customerId: stripeCustomerId, type: "card" },
        { skip: !stripeCustomerId || currentStep < 2 }
    );

    const paymentMethods = paymentMethodsData?.paymentMethods || [];

    const handleConfirmBooking = useCallback(async () => {
        if (!bookingDetails || !property) return;

        setConfirmingBooking(true);
        try {
            //     const res = await fetch("/api/bookings", {
            //         method: "POST",
            //         headers: { "Content-Type": "application/json" },
            //         body: JSON.stringify({
            //             property_id: property.id,
            //             check_in: bookingDetails.checkIn.toISOString(),
            //             check_out: bookingDetails.checkOut.toISOString(),
            //             guests: bookingDetails.guests,
            //             pricing: {
            //                 currency: bookingDetails.currency,
            //                 nights: bookingDetails.nights,
            //                 price_per_night: bookingDetails.pricePerNight,
            //                 subtotal: bookingDetails.subtotal,
            //                 cleaning_fee: bookingDetails.cleaningFee,
            //                 service_fee: bookingDetails.serviceFee,
            //                 total: bookingDetails.total,
            //             },
            //         }),
            //     });

            //     const data = await res.json();
            //     if (!res.ok)
            //         throw new Error(data?.error || "Failed to confirm booking.");

            //     const idFromApi =
            //         data?.bookingId || data?.booking_id || data?.id || null;
            //     setBookingId(idFromApi);
            setCurrentStep(2);
        } catch (e) {
            alert(e?.message || "Failed to confirm booking.");
        } finally {
            setConfirmingBooking(false);
        }
    }, [bookingDetails, property]);

    const handleAddNewPaymentMethod = useCallback(async () => {
        if (!stripeCustomerId) {
            alert("Stripe customer is not available.");
            return;
        }

        try {
            const result = await addPaymentMethod({
                customerId: stripeCustomerId,
                flow: "customer_portal",
                return_url: window.location.href,
            }).unwrap();

            if (result?.url) {
                window.location.href = result.url;
                return;
            }

            throw new Error(result?.error || "No redirect url returned.");
        } catch (e) {
            const msg =
                e?.data?.error ||
                e?.error ||
                e?.message ||
                "Failed to open payment settings.";
            alert(msg);
        }
    }, [stripeCustomerId, addPaymentMethod]);

    const handleSelectPaymentMethod = useCallback((pm) => {
        setSelectedPaymentMethod(pm);
    }, []);

    const handleContinueFromPaymentMethods = useCallback(() => {
        if (!selectedPaymentMethod?.id) return;
        setCurrentStep(3);
    }, [selectedPaymentMethod]);

    const handlePay = useCallback(async () => {
        if (!bookingDetails || !stripeCustomerId || !selectedPaymentMethod?.id)
            return;

        try {
            // Always send amount+currency so the server can create Checkout even if bookingId is not ready yet.

            const successUrl = `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
            const cancelUrl = `${window.location.origin}/payment/cancel${
                bookingId ? `?booking_id=${encodeURIComponent(bookingId)}` : ""
            }`;

            const result = await makePayment({
                customerId: stripeCustomerId,
                booking_id: bookingId || undefined,
                // payment_method_id: selectedPaymentMethod.id,

                line_items: [
                    {
                        price_data: {
                            currency: bookingDetails.currency || "qar",
                            product_data: {
                                name: property.title,
                                description:
                                    property.title || "Booking payment",
                            },
                            unit_amount: bookingDetails.total,
                        },
                        quantity: 1,
                    },
                ],

                amount: bookingDetails.total,
                currency: bookingDetails.currency,

                description: bookingDetails.description,
                metadata: {
                    booking_id: bookingId || "",
                    property_id: bookingDetails.propertyId,
                },

                success_url: successUrl,
                cancel_url: cancelUrl,
            }).unwrap();
            console.log("results: ", result);

            if (result?.url) {
                window.location.assign(result.url);
                return;
            }

            throw new Error(
                result?.error || "No payment redirect url returned."
            );
        } catch (e) {
            const msg =
                e?.data?.error ||
                e?.error ||
                e?.message ||
                "Failed to start payment.";
            alert(msg);
        }
    }, [
        bookingDetails,
        bookingId,
        stripeCustomerId,
        selectedPaymentMethod,
        makePayment,
    ]);

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
                    {/* LEFT COLUMN */}
                    <div className="space-y-10">
                        {/* 1. Review your booking */}
                        <section>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    1. Review your booking
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
                                    <div className="space-y-4">
                                        <div className="text-sm text-gray-600">
                                            <div className="font-semibold text-gray-900 mb-1">
                                                Cancellation policy
                                            </div>
                                            <div>
                                                Free cancellation before
                                                check-in. Terms apply.
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-600">
                                            <div className="font-semibold text-gray-900 mb-1">
                                                Refund policy
                                            </div>
                                            <div>
                                                Eligible refunds are processed
                                                back to the original payment
                                                method.
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-600">
                                            <div className="font-semibold text-gray-900 mb-1">
                                                Check-in / Check-out
                                            </div>
                                            <div>
                                                {bookingDetails?.dateString}
                                            </div>
                                            <div className="mt-1">
                                                Guests:{" "}
                                                {bookingDetails?.guestString}
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-600">
                                            <div className="font-semibold text-gray-900 mb-1">
                                                Fees
                                            </div>
                                            <div className="text-xs leading-relaxed">
                                                Total:{" "}
                                                <span className="font-bold text-black">
                                                    {bookingDetails?.currency}{" "}
                                                    {bookingDetails?.total.toLocaleString()}
                                                </span>{" "}
                                                for {bookingDetails?.nights}{" "}
                                                nights.
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full sm:w-[220px] bg-black text-white h-12 rounded-lg"
                                        onClick={handleConfirmBooking}
                                        disabled={confirmingBooking}
                                    >
                                        {confirmingBooking
                                            ? "Confirming..."
                                            : "Confirm booking"}
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-600">
                                    Booking confirmed
                                    {bookingId ? ` (Ref: ${bookingId})` : ""}.
                                </div>
                            )}
                        </section>

                        <Separator />

                        {/* 2. Select payment method */}
                        <section>
                            <div className="flex justify-between items-center mb-6">
                                <h2
                                    className={`text-xl font-semibold ${
                                        currentStep >= 2
                                            ? "text-gray-900"
                                            : "text-gray-400"
                                    }`}
                                >
                                    2. Select payment method
                                </h2>
                                {currentStep > 2 && (
                                    <Button
                                        variant="ghost"
                                        className="font-semibold underline hover:bg-transparent px-0"
                                        onClick={() => setCurrentStep(2)}
                                    >
                                        Change
                                    </Button>
                                )}
                            </div>

                            {currentStep === 2 ? (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    {!stripeCustomerId && (
                                        <div className="text-sm text-gray-600">
                                            No Stripe customer found for this
                                            user.
                                        </div>
                                    )}

                                    {stripeCustomerId &&
                                        paymentMethodsLoading && (
                                            <div className="text-sm text-gray-600">
                                                Loading payment methods...
                                            </div>
                                        )}

                                    {stripeCustomerId &&
                                        paymentMethodsIsError && (
                                            <div className="text-sm text-red-600">
                                                {paymentMethodsError?.data
                                                    ?.error ||
                                                    paymentMethodsError?.error ||
                                                    "Failed to load payment methods."}
                                            </div>
                                        )}

                                    {stripeCustomerId &&
                                        !paymentMethodsLoading &&
                                        !paymentMethodsIsError && (
                                            <div className="space-y-3">
                                                {paymentMethods.length > 0 ? (
                                                    (() => {
                                                        // If your API already returns newest-first, keep as-is.
                                                        // If it returns oldest-first, reverse it:
                                                        // const ordered = [...paymentMethods].reverse();

                                                        const ordered =
                                                            paymentMethods; // assume newest-first
                                                        const topThree =
                                                            ordered.slice(0, 3);
                                                        const rest =
                                                            ordered.slice(3);
                                                        const finalList = [
                                                            ...topThree,
                                                            ...rest,
                                                        ];

                                                        return (
                                                            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                                                                {finalList.map(
                                                                    (
                                                                        pm,
                                                                        index
                                                                    ) => {
                                                                        const isSelected =
                                                                            selectedPaymentMethod?.id ===
                                                                            pm.id;

                                                                        // Optional: visually indicate the top 3 (most recent)
                                                                        const isRecent =
                                                                            index <
                                                                            3;

                                                                        return (
                                                                            <button
                                                                                key={
                                                                                    pm.id
                                                                                }
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleSelectPaymentMethod(
                                                                                        pm
                                                                                    )
                                                                                }
                                                                                className={`w-full border rounded-xl p-4 text-left ${
                                                                                    isSelected
                                                                                        ? "border-black"
                                                                                        : ""
                                                                                }`}
                                                                            >
                                                                                <div className="flex items-center justify-between">
                                                                                    <div className="flex items-center gap-3">
                                                                                        <CreditCard className="w-6 h-6" />
                                                                                        <span>
                                                                                            {pm.brand?.toUpperCase?.() ||
                                                                                                "Card"}{" "}
                                                                                            ••••{" "}
                                                                                            {
                                                                                                pm.last4
                                                                                            }
                                                                                        </span>

                                                                                        {isRecent && (
                                                                                            <span className="text-xs text-gray-500 border rounded-full px-2 py-0.5">
                                                                                                Recent
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="text-sm text-gray-500">
                                                                                        {
                                                                                            pm.exp_month
                                                                                        }

                                                                                        /
                                                                                        {
                                                                                            pm.exp_year
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </button>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        );
                                                    })()
                                                ) : (
                                                    <div className="text-sm text-gray-600">
                                                        No saved payment methods
                                                        found.
                                                    </div>
                                                )}

                                                <div className="flex gap-3 pt-2">
                                                    <Button
                                                        variant="outline"
                                                        className="h-12 rounded-lg"
                                                        onClick={
                                                            handleAddNewPaymentMethod
                                                        }
                                                        disabled={
                                                            addingPaymentMethod
                                                        }
                                                    >
                                                        {addingPaymentMethod
                                                            ? "Opening..."
                                                            : "Add new payment method"}
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        className="h-12 rounded-lg underline"
                                                        onClick={
                                                            refetchPaymentMethods
                                                        }
                                                    >
                                                        Refresh
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                    <Button
                                        className="w-full sm:w-[160px] bg-black text-white h-12 rounded-lg"
                                        onClick={
                                            handleContinueFromPaymentMethods
                                        }
                                        disabled={!selectedPaymentMethod?.id}
                                    >
                                        Continue
                                    </Button>
                                </div>
                            ) : (
                                // ✅ FIX #1: Show selected payment method summary after continuing
                                <div className="flex items-center gap-2 text-gray-600">
                                    <CreditCard className="w-5 h-5" />
                                    {selectedPaymentMethod?.id ? (
                                        <span>
                                            {selectedPaymentMethod.brand?.toUpperCase?.() ||
                                                "Card"}{" "}
                                            •••• {selectedPaymentMethod.last4}
                                        </span>
                                    ) : (
                                        <span>Not selected</span>
                                    )}
                                </div>
                            )}
                        </section>

                        <Separator />

                        {/* 3. Pay */}
                        <section>
                            <h2
                                className={`text-xl font-semibold mb-4 ${
                                    currentStep === 3
                                        ? "text-gray-900"
                                        : "text-gray-400"
                                }`}
                            >
                                3. Pay
                            </h2>

                            {currentStep === 3 && (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    <div className="text-xs text-gray-600 leading-relaxed">
                                        Total:{" "}
                                        <span className="font-bold text-black">
                                            {bookingDetails?.currency}{" "}
                                            {bookingDetails?.total.toLocaleString()}
                                        </span>{" "}
                                        for {bookingDetails?.nights} nights.
                                    </div>

                                    {/* ✅ FIX #2: Redirect to Stripe Checkout URL returned by API */}
                                    <Button
                                        className="w-full sm:w-[160px] bg-black text-white h-12 rounded-lg"
                                        onClick={handlePay}
                                        disabled={creatingPayment}
                                    >
                                        {creatingPayment
                                            ? "Redirecting..."
                                            : "Pay"}
                                    </Button>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* RIGHT COLUMN: Order Summary (unchanged) */}
                    <div className="lg:pl-10">
                        <div className="sticky top-28 border rounded-xl p-6 shadow-sm bg-white">
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

                            <div className="space-y-4">
                                <div>
                                    <div className="font-semibold text-gray-900">
                                        Dates
                                    </div>
                                    <div className="text-gray-600">
                                        {bookingDetails?.dateString}
                                    </div>
                                </div>

                                <div>
                                    <div className="font-semibold text-gray-900">
                                        Guests
                                    </div>
                                    <div className="text-gray-600">
                                        {bookingDetails?.guestString}
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-6" />

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
                    {/* END RIGHT COLUMN */}
                </div>
            </div>
        </div>
    );
}
