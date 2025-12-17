import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET(_req, { params }) {
    try {
        const { customerId } = await params;

        const customer = await stripe.customers.retrieve(customerId);
        return NextResponse.json(customer, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { error: err?.message || "Failed to retrieve customer" },
            { status: 500 }
        );
    }
}
