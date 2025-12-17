import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET(req, { params }) {
    try {
        const { customerId } = await params;
        const { searchParams } = new URL(req.url);

        const limit = Number(searchParams.get("limit") || 20);
        const starting_after = searchParams.get("starting_after") || undefined;
        const ending_before = searchParams.get("ending_before") || undefined;

        const paymentIntents = await stripe.paymentIntents.list({
            customer: customerId,
            limit: Math.min(limit, 100),
            ...(starting_after ? { starting_after } : {}),
            ...(ending_before ? { ending_before } : {}),
        });

        return NextResponse.json(
            {
                customerId,
                transactions: paymentIntents.data,
                has_more: paymentIntents.has_more,
            },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            { error: err?.message || "Failed to list transactions" },
            { status: 500 }
        );
    }
}
