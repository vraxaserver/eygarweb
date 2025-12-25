// components/PaymentSync.js
"use client";

import { useEffect, useRef } from "react";
import { useCreatePaymentMutation } from "@/store/features/paymentApi";
import { useUpdateBookingPaymentSuccessfulMutation } from "@/store/features/bookingApi";

export default function PaymentSync({ paymentData }) {
    const [createPayment] = useCreatePaymentMutation();
    const [updateBookingStatus] = useUpdateBookingPaymentSuccessfulMutation();
    // Use a ref to ensure we only try to record this once per mount
    const hasRecorded = useRef(false);

    useEffect(() => {
        if (hasRecorded.current) return;
        hasRecorded.current = true;

        const recordPayment = async () => {
            try {
                // We pass the session_id to the payload so the backend
                // can check if it already exists (Idempotency)
                await createPayment({
                    ...paymentData,
                }).unwrap();
                console.log("Payment recorded successfully");
            } catch (error) {
                // If error is "Already exists", that's fine.
                console.error("Failed to record payment:", error);
            }
        };

        recordPayment();

        (async () => {
            // 2) update booking status
            await updateBookingStatus({
                bookingId: paymentData.booking_id,
                payment_details: paymentData,
            }).unwrap();
        })();
    }, [paymentData, createPayment, updateBookingStatus]);

    return null; // This component renders nothing
}
