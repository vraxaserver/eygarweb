import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json(
                { error: "email query param is required" },
                { status: 400 }
            );
        }

        const customers = await stripe.customers.list({ email, limit: 1 });
        const customer = customers.data?.[0] || null;

        if (!customer) {
            return NextResponse.json(
                { error: "Customer not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(customer, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { error: err?.message || "Failed to get customer" },
            { status: 500 }
        );
    }
}
