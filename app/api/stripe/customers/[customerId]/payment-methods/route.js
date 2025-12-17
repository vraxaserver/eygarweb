import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET(req, { params }) {
    try {
        const { customerId } = await params;
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type") || "card";

        const pms = await stripe.paymentMethods.list({
            customer: customerId,
            type,
        });

        // Return a compact shape for UI
        const paymentMethods = pms.data.map((pm) => ({
            id: pm.id,
            type: pm.type,
            brand: pm.card?.brand,
            last4: pm.card?.last4,
            exp_month: pm.card?.exp_month,
            exp_year: pm.card?.exp_year,
        }));

        return NextResponse.json({ paymentMethods }, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { error: err?.message || "Failed to list payment methods" },
            { status: 500 }
        );
    }
}

export async function POST(req, { params }) {
    try {
        const { customerId } = await params;
        const body = await req.json();
        const { flow, payment_method_id, return_url } = body || {};

        if (flow === "setup_intent") {
            const si = await stripe.setupIntents.create({
                customer: customerId,
                payment_method_types: ["card"],
                usage: "off_session",
            });

            return NextResponse.json(
                { flow: "setup_intent", client_secret: si.client_secret },
                { status: 200 }
            );
        }

        if (flow === "attach") {
            if (!payment_method_id) {
                return NextResponse.json(
                    { error: "payment_method_id is required for attach flow" },
                    { status: 400 }
                );
            }

            const pm = await stripe.paymentMethods.attach(payment_method_id, {
                customer: customerId,
            });

            // Optional: set as default for invoices
            await stripe.customers.update(customerId, {
                invoice_settings: { default_payment_method: pm.id },
            });

            return NextResponse.json(
                { flow: "attach", paymentMethod: pm },
                { status: 200 }
            );
        }

        if (flow === "customer_portal") {
            const session = await stripe.billingPortal.sessions.create({
                customer: customerId,
                return_url:
                    return_url ||
                    process.env.APP_URL ||
                    "http://localhost:3000",
            });

            return NextResponse.json(
                { flow: "customer_portal", url: session.url },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                error: "Invalid flow. Use: setup_intent | attach | customer_portal",
            },
            { status: 400 }
        );
    } catch (err) {
        return NextResponse.json(
            { error: err?.message || "Failed to add payment method" },
            { status: 500 }
        );
    }
}
