"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CheckoutClient({ checkoutData }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleCheckout() {
        try {
            setLoading(true);

            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(checkoutData),
            });
            const data = await res.json();
            console.log("Response data:", data);

            if (!res.ok) throw new Error(data?.error || "Checkout failed");

            router.push(data.url);
        } catch (e) {
            console.error(e);
            alert(e.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full lg:w-1/2 bg-[#E31C5F] hover:bg-[#D11152] text-white font-bold text-lg h-14 rounded-lg shadow-md"
            >
                {loading ? "Processing..." : "Confirm and pay"}
            </Button>
        </div>
    );
}
