// components/PaymentSync.js
"use client";

import { useEffect, useRef } from "react";
import { useCreatePaymentMutation } from "@/store/features/paymentApi";

export default function PaymentSync({ paymentData }) {
    const [createPayment] = useCreatePaymentMutation();
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
    }, [createPayment, paymentData]);

    return null; // This component renders nothing
}
