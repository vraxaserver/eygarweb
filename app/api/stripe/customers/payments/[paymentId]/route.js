import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import React from "react";

export const runtime = "nodejs";

export async function GET(_req, { params }) {
    try {
        const { customerId, paymentId } = React.use(params);

        const pi = await stripe.paymentIntents.retrieve(paymentId);

        // Optional safety check: confirm this PI belongs to the same customer
        if (pi.customer && String(pi.customer) !== String(customerId)) {
            return NextResponse.json(
                { error: "Payment does not belong to this customer" },
                { status: 403 }
            );
        }

        return NextResponse.json(pi, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { error: err?.message || "Failed to retrieve payment details" },
            { status: 500 }
        );
    }
}
