import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req) {
    try {
        const body = await req.json();

        const {
            customerId, // ✅ NOW coming from request body
            booking_id,
            amount, // smallest unit (e.g. QAR * 100)
            line_items,
            payment_method_id,
            currency,
            description,
            metadata,
            success_url,
            cancel_url,
        } = body || {};

        // return NextResponse.json(body);

        if (!customerId) {
            return NextResponse.json(
                { error: "customerId is required" },
                { status: 400 }
            );
        }

        if (!booking_id && (!amount || !currency)) {
            return NextResponse.json(
                { error: "Provide booking_id OR (amount and currency)" },
                { status: 400 }
            );
        }

        const unitAmount = Number(amount);
        if (!unitAmount || unitAmount <= 0) {
            return NextResponse.json(
                { error: "Invalid payment amount" },
                { status: 400 }
            );
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            customer: customerId,

            payment_method_types: ["card"],
            // payment_method_id: payment_method_id,
            payment_intent_data: {
                setup_future_usage: "off_session",
                metadata: { booking_id: booking_id || "", ...(metadata || {}) },
            },

            line_items: line_items,

            success_url:
                success_url ||
                `${
                    process.env.APP_URL || "http://localhost:3000"
                }/payment/success?session_id={CHECKOUT_SESSION_ID}`,

            cancel_url:
                cancel_url ||
                `${
                    process.env.APP_URL || "http://localhost:3000"
                }/payment/cancel?booking_id=${booking_id || ""}`,

            metadata: {
                booking_id: booking_id || "",
                ...(metadata || {}),
            },
        });

        return NextResponse.json(
            { url: session.url, id: session.id },
            { status: 200 }
        );
    } catch (err) {
        console.error("Stripe payment error:", err);

        return NextResponse.json(
            { error: err?.message || "Failed to create payment" },
            { status: 500 }
        );
    }
}
