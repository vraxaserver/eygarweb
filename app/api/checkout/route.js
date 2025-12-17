import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "@/lib/stripe";

export async function POST(req) {
    const body = await req.json();
    const items = body["line_items"];
    const mode = body["mode"];

    // return NextResponse.json(body);
    try {
        const headersList = await headers();
        const origin = headersList.get("origin");
        // return NextResponse.json(body);

        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
            line_items: items,
            mode: mode,
            success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            // saved_payment_method_options: {
            //     payment_method_save: "enabled",
            // },
        });
        return NextResponse.json(session);
        // return NextResponse.redirect(session.url, 303);
    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 }
        );
    }
}
