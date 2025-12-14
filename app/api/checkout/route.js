import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
});

export async function POST(req) {
    try {
        const origin = req.headers.get("origin");

        if (!origin) {
            return NextResponse.json(
                { error: "Missing origin header" },
                { status: 400 }
            );
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "QAR",
                        product_data: {
                            name: "Your Product Name",
                        },
                        unit_amount: 1000, // $10.00
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${origin}/success`,
            cancel_url: `${origin}/cancel`,
        });

        return NextResponse.json({ id: session.id }, { status: 200 });
    } catch (error) {
        console.error("Stripe checkout error:", error);
        return NextResponse.json(
            { error: "Failed to create checkout session" },
            { status: 500 }
        );
    }
}

/**
 * Optional: Explicitly block other methods
 */
export async function GET() {
    return NextResponse.json(
        { error: "Method Not Allowed" },
        {
            status: 405,
            headers: { Allow: "POST" },
        }
    );
}
