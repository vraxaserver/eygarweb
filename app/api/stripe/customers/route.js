import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, name, phone, metadata } = body || {};

        if (!email) {
            return NextResponse.json(
                { error: "email is required" },
                { status: 400 }
            );
        }

        // Optional: avoid duplicate customers by searching first
        const existing = await stripe.customers.list({ email, limit: 1 });
        if (existing.data?.length) {
            return NextResponse.json(existing.data[0], { status: 200 });
        }

        const customer = await stripe.customers.create({
            email,
            name,
            phone,
            metadata: metadata || {},
        });

        return NextResponse.json(customer, { status: 201 });
    } catch (err) {
        return NextResponse.json(
            { error: err?.message || "Failed to create customer" },
            { status: 500 }
        );
    }
}
