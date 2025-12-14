"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);
export default function CheckoutClient() {
    const [loading, setLoading] = useState(false);
    const [payment, setPayment] = useState(false);

    async function handleCheckout() {
        try {
            setLoading(true);
            const stripe = await stripePromise;

            const res = await fetch("/api/checkout", { method: "POST" });
            const data = await res.json();

            if (!res.ok) throw new Error(data?.error || "Checkout failed");

            // If you use Stripe.js, redirect here
            // const stripe = await getStripe();

            // ✅ New Stripe-supported redirect
            // window.location.href = data.url;

            // Temporary: just log session id
            console.log("Checkout session id:", data.id);
            setPayment(data);
        } catch (e) {
            console.error(e);
            alert(e.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Checkout Page</h1>
            {JSON.stringify(payment)}
            <Button onClick={handleCheckout} disabled={loading}>
                {loading ? "Processing..." : "Pay with Card"}
            </Button>
        </div>
    );
}
