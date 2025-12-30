"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, CreditCard, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useGetPropertyByIdQuery } from "@/store/features/propertiesApi";
import { useSelector, shallowEqual } from "react-redux";
import {
    selectStripeCustomerId,
    selectCurrentUser,
} from "@/store/slices/authSlice";
import {
    selectBookingDates,
    selectBookingFees,
    selectBookingGuests,
} from "@/store/slices/bookingSlice";

import { useCreateBookingMutation } from "@/store/features/bookingApi";

import {
    useGetPaymentMethodsQuery,
    useAddPaymentMethodMutation,
    useMakePaymentMutation,
} from "@/store/features/stripeApi";

// ---------------------------
// Helpers
// ---------------------------
const formatDateRange = (checkInDate, checkOutDate) => {
    if (!(checkInDate instanceof Date) || !(checkOutDate instanceof Date))
        return null;
    if (
        Number.isNaN(checkInDate.getTime()) ||
        Number.isNaN(checkOutDate.getTime())
    )
        return null;

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
    const n = Number(amountMajor);
    if (!Number.isFinite(n) || n <= 0) return 0;
    return Math.round(n * 100);
};

export default function ReservePage({ params }) {
    // ✅ FIX: Next.js params is already an object
    const { id } = React.use(params);

    const router = useRouter();

    const [createBooking] = useCreateBookingMutation();
    const [addPaymentMethod, { isLoading: addingPaymentMethod }] =
        useAddPaymentMethodMutation();
    const [makePayment, { isLoading: creatingPayment }] =
        useMakePaymentMutation();

    // ✅ Reduce re-renders from selectors with shallowEqual
    const stripeCustomerId = useSelector(selectStripeCustomerId);
    const currentUser = useSelector(selectCurrentUser);

    const { checkInDate, checkOutDate } =
        useSelector(selectBookingDates, shallowEqual) || {};
    const guests = useSelector(selectBookingGuests, shallowEqual) || {};
    const fees = useSelector(selectBookingFees, shallowEqual) || {};

    const {
        data: property,
        isLoading: propertyLoading,
        isError: propertyIsError,
    } = useGetPropertyByIdQuery(id, { skip: !id });

    // Flow state
    const [currentStep, setCurrentStep] = useState(1);
    const [bookingId, setBookingId] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    // ✅ Prevent double-submit
    const [confirmingBooking, setConfirmingBooking] = useState(false);

    const bookingDetails = useMemo(() => {
        if (!property) return null;

        const nights = Number(fees?.nights || 0);
        const validNights = nights > 0 ? nights : 1;

        const pricePerNight = Number(fees?.price_per_night || 0);
        const subtotal = Number(fees?.subtotal || 0);

        const cleaningFee = Number(fees?.cleaning_fee || 0);
        const serviceFee = Number(fees?.service_fee || 0);

        const total = Number(fees?.total_amount || 0);
        const currency = (
            fees?.currency ||
            property?.currency ||
            "qar"
        ).toLowerCase();

        const dateString = formatDateRange(checkInDate, checkOutDate);
        const guestString = buildGuestString(guests);

        const unitAmountCents = toMinorUnits(total);

        const coverImage =
            property.images?.find((img) => img.is_cover)?.image_url ||
            property.images?.[0]?.image_url;

        return {
            propertyId: property.id,
            propertyTitle: property.title,
            placeTypeLabel: property.place_type?.replaceAll("_", " ") || "",

            checkIn: checkInDate,
            checkOut: checkOutDate,
            nights: validNights,
            dateString,

            guests,
            guestString,

            pricePerNight,
            subtotal,
            cleaningFee,
            serviceFee,
            total,
            totalCents: unitAmountCents,
            currency,

            coverImage,
        };
    }, [property, fees, guests, checkInDate, checkOutDate]);

    // ✅ Prebuild formatters once (faster than repeating toLocaleString all over)
    const moneyFormatter = useMemo(() => {
        const cur = bookingDetails?.currency?.toUpperCase() || "QAR";
        // If Intl currency code is invalid, fallback to plain number formatting
        try {
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: cur,
            });
        } catch {
            return new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        }
    }, [bookingDetails?.currency]);

    const formatMoney = useCallback(
        (amount) => {
            const n = Number(amount || 0);
            const cur = bookingDetails?.currency?.toUpperCase();
            // If formatter is in currency mode, it's already including symbol; you may prefer custom "QAR 123.45"
            // Here we keep your style: "QAR 123.45"
            return `${cur || "QAR"} ${new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(n)}`;
        },
        [bookingDetails?.currency]
    );

    const {
        data: paymentMethodsData,
        isLoading: paymentMethodsLoading,
        isError: paymentMethodsIsError,
        error: paymentMethodsError,
        refetch: refetchPaymentMethods,
    } = useGetPaymentMethodsQuery(
        { customerId: stripeCustomerId },
        { skip: !stripeCustomerId || currentStep < 2 }
    );

    const paymentMethods = paymentMethodsData?.paymentMethods ?? [];

    // ✅ Avoid reversing on every render
    const orderedPaymentMethods = useMemo(() => {
        // If API returns newest-first, use as-is.
        // If API returns oldest-first, reverse once here.
        return [...paymentMethods].reverse();
    }, [paymentMethods]);

    const handleConfirmBooking = useCallback(async () => {
        if (confirmingBooking) return;
        if (!bookingDetails) return;
        if (!property?.id) return;

        if (!bookingDetails.checkIn || !bookingDetails.checkOut) {
            alert("Please select valid check-in and check-out dates.");
            return;
        }

        setConfirmingBooking(true);

        const guestsCount = Object.values(bookingDetails.guests || {}).reduce(
            (sum, v) => sum + Number(v || 0),
            0
        );

        const booking_req_body = {
            property_id: property.id,
            property_snapshot: property,
            check_in_date: bookingDetails.checkIn,
            check_out_date: bookingDetails.checkOut,
            guests_count: guestsCount,
            currency: bookingDetails.currency?.toUpperCase(),
            nights_stay: bookingDetails.nights,
            price_per_night: bookingDetails.pricePerNight,
            subtotal_amount: bookingDetails.subtotal,
            cleaning_fee: bookingDetails.cleaningFee,
            service_fee: bookingDetails.serviceFee,
            total_amount: bookingDetails.total,
        };

        try {
            const res = await createBooking(booking_req_body).unwrap();

            const newBookingId =
                res?.bookingId || res?.booking_id || res?._id || null;
            if (!newBookingId)
                throw new Error("Booking created but booking id not returned.");

            setBookingId(newBookingId);
            setCurrentStep(2);
        } catch (err) {
            console.error("Booking confirmation failed:", err);
            alert(
                err?.data?.error ||
                    err?.error ||
                    err?.message ||
                    "Failed to confirm booking."
            );
        } finally {
            setConfirmingBooking(false);
        }
    }, [confirmingBooking, bookingDetails, property, createBooking]);

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
                window.location.assign(result.url);
                return;
            }

            throw new Error(result?.error || "No redirect url returned.");
        } catch (e) {
            alert(
                e?.data?.error ||
                    e?.error ||
                    e?.message ||
                    "Failed to open payment settings."
            );
        }
    }, [stripeCustomerId, addPaymentMethod]);

    const handleSelectPaymentMethod = useCallback((pm) => {
        setSelectedPaymentMethod(pm);
    }, []);

    const handleContinueFromPaymentMethods = useCallback(() => {
        if (!selectedPaymentMethod?.id) return;
        setCurrentStep(3);
    }, [selectedPaymentMethod?.id]);

    const handlePay = useCallback(async () => {
        if (!bookingDetails || !stripeCustomerId || !selectedPaymentMethod?.id)
            return;

        if (!bookingId) {
            alert(
                "Booking reference is missing. Please confirm booking again."
            );
            setCurrentStep(1);
            return;
        }

        // Validate amount
        const amountCents = Number(bookingDetails.totalCents);
        if (!Number.isInteger(amountCents) || amountCents <= 0) {
            alert("Invalid payment amount. Please re-check pricing.");
            return;
        }

        const currencyLower = (bookingDetails.currency || "qar").toLowerCase();
        const currencyUpper = currencyLower.toUpperCase();

        try {
            const successUrl = `${
                window.location.origin
            }/payment/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${encodeURIComponent(
                bookingId
            )}`;
            const cancelUrl = `${
                window.location.origin
            }/payment/cancel?booking_id=${encodeURIComponent(bookingId)}`;

            const payload = {
                customerId: stripeCustomerId,
                booking_id: bookingId,

                // IMPORTANT: send the selected payment method id
                payment_method_id: selectedPaymentMethod.id,

                // Send amount in both formats (backend may read either)
                amount_cents: amountCents, // 24710
                amount: amountCents / 100, // 247.10
                currency: currencyLower, // "qar"
                currency_code: currencyUpper, // "QAR" (optional if backend uses it)

                // If backend creates a Checkout Session from line_items, keep this too:
                line_items: [
                    {
                        price_data: {
                            currency: currencyLower,
                            product_data: {
                                name:
                                    bookingDetails.propertyTitle ||
                                    "Booking payment",
                                description:
                                    bookingDetails.propertyTitle ||
                                    "Booking payment",
                            },
                            unit_amount: amountCents, // MUST be integer
                        },
                        quantity: 1,
                    },
                ],

                metadata: {
                    user_id: currentUser?.id || "unknown",
                    booking_id: bookingId,
                    property_id: bookingDetails.propertyId,
                },

                success_url: successUrl,
                cancel_url: cancelUrl,
            };

            console.log("[makePayment] payload:", payload);

            const result = await makePayment(payload).unwrap();

            if (result?.url) {
                window.location.assign(result.url);
                return;
            }

            throw new Error(
                result?.error || "No payment redirect url returned."
            );
        } catch (e) {
            alert(
                e?.data?.error ||
                    e?.error ||
                    e?.message ||
                    "Failed to start payment."
            );
        }
    }, [
        bookingDetails,
        bookingId,
        stripeCustomerId,
        selectedPaymentMethod?.id,
        makePayment,
        currentUser,
        setCurrentStep,
    ]);

    if (propertyLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (propertyIsError || !property || !bookingDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Error loading property
            </div>
        );
    }

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
                                                {bookingDetails.dateString}
                                            </div>
                                            <div className="mt-1">
                                                Guests:{" "}
                                                {bookingDetails.guestString}
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-600">
                                            <div className="font-semibold text-gray-900 mb-1">
                                                Fees
                                            </div>
                                            <div className="text-xs leading-relaxed">
                                                Total:{" "}
                                                <span className="font-bold text-black">
                                                    {formatMoney(
                                                        bookingDetails.total
                                                    )}
                                                </span>{" "}
                                                for {bookingDetails.nights}{" "}
                                                nights.
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full sm:w-[220px] bg-black text-white h-12 rounded-lg"
                                        disabled={confirmingBooking}
                                        onClick={handleConfirmBooking}
                                    >
                                        {confirmingBooking
                                            ? "Confirming..."
                                            : "Confirm Booking"}
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
                                                {orderedPaymentMethods.length >
                                                0 ? (
                                                    <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                                                        {orderedPaymentMethods.map(
                                                            (pm, index) => {
                                                                const isSelected =
                                                                    selectedPaymentMethod?.id ===
                                                                    pm.id;
                                                                const isRecent =
                                                                    index < 3;

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
                                                                                : "border-gray-200"
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
                                            {formatMoney(bookingDetails.total)}
                                        </span>{" "}
                                        for {bookingDetails.nights} nights.
                                    </div>

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

                    {/* RIGHT COLUMN */}
                    <div className="lg:pl-10">
                        <div className="sticky top-28 border rounded-xl p-6 shadow-sm bg-white">
                            <div className="flex gap-4 mb-6">
                                <div className="relative w-28 h-24 flex-shrink-0">
                                    <img
                                        src={bookingDetails.coverImage}
                                        alt={property.title}
                                        className="object-cover w-full h-full rounded-lg"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="flex flex-col justify-between">
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1 capitalize">
                                            {bookingDetails.placeTypeLabel}
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
                                        {bookingDetails.dateString}
                                    </div>
                                </div>

                                <div>
                                    <div className="font-semibold text-gray-900">
                                        Guests
                                    </div>
                                    <div className="text-gray-600">
                                        {bookingDetails.guestString}
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
                                        {bookingDetails.currency.toUpperCase()}{" "}
                                        {new Intl.NumberFormat("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }).format(
                                            property.price_per_night
                                        )}{" "}
                                        x {bookingDetails.nights} night
                                        {bookingDetails.nights !== 1 ? "s" : ""}
                                    </div>
                                    <div>
                                        {formatMoney(bookingDetails.subtotal)}
                                    </div>
                                </div>

                                {bookingDetails.cleaningFee > 0 && (
                                    <div className="flex justify-between text-gray-600">
                                        <div className="underline">
                                            Cleaning fee
                                        </div>
                                        <div>
                                            {formatMoney(
                                                bookingDetails.cleaningFee
                                            )}
                                        </div>
                                    </div>
                                )}

                                {bookingDetails.serviceFee > 0 && (
                                    <div className="flex justify-between text-gray-600">
                                        <div className="underline">
                                            Service fee
                                        </div>
                                        <div>
                                            {formatMoney(
                                                bookingDetails.serviceFee
                                            )}
                                        </div>
                                    </div>
                                )}

                                <Separator className="my-2" />

                                <div className="flex justify-between font-semibold text-base text-gray-900">
                                    <div className="underline">Total</div>
                                    <div>
                                        {formatMoney(bookingDetails.total)}
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
