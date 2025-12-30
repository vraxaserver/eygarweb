import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

// Enumerate the payment method types you want to support listing.
// Stripe requires a single "type" per list() call, so "all" must be done via multiple calls.
const SUPPORTED_PM_TYPES = [
    "card",
    "us_bank_account",
    "sepa_debit",
    "bacs_debit",
    "au_becs_debit",
    "acss_debit",
    "link",
    // Add others you need (e.g., "cashapp", etc.) depending on what you enable in Stripe.
];

function compactPM(pm) {
    const base = { id: pm.id, type: pm.type };

    // Per-type fields
    if (pm.type === "card" && pm.card) {
        return {
            ...base,
            brand: pm.card.brand,
            last4: pm.card.last4,
            exp_month: pm.card.exp_month,
            exp_year: pm.card.exp_year,
        };
    }

    if (pm.type === "us_bank_account" && pm.us_bank_account) {
        return {
            ...base,
            bank_name: pm.us_bank_account.bank_name ?? null,
            last4: pm.us_bank_account.last4 ?? null,
            routing_number: pm.us_bank_account.routing_number ?? null,
            account_type: pm.us_bank_account.account_type ?? null,
        };
    }

    if (pm.type === "sepa_debit" && pm.sepa_debit) {
        return {
            ...base,
            bank_code: pm.sepa_debit.bank_code ?? null,
            branch_code: pm.sepa_debit.branch_code ?? null,
            country: pm.sepa_debit.country ?? null,
            fingerprint: pm.sepa_debit.fingerprint ?? null,
            last4: pm.sepa_debit.last4 ?? null,
        };
    }

    if (pm.type === "bacs_debit" && pm.bacs_debit) {
        return {
            ...base,
            last4: pm.bacs_debit.last4 ?? null,
            sort_code: pm.bacs_debit.sort_code ?? null,
            fingerprint: pm.bacs_debit.fingerprint ?? null,
        };
    }

    if (pm.type === "au_becs_debit" && pm.au_becs_debit) {
        return {
            ...base,
            last4: pm.au_becs_debit.last4 ?? null,
            bsb_number: pm.au_becs_debit.bsb_number ?? null,
            fingerprint: pm.au_becs_debit.fingerprint ?? null,
        };
    }

    if (pm.type === "acss_debit" && pm.acss_debit) {
        return {
            ...base,
            bank_name: pm.acss_debit.bank_name ?? null,
            last4: pm.acss_debit.last4 ?? null,
            institution_number: pm.acss_debit.institution_number ?? null,
            transit_number: pm.acss_debit.transit_number ?? null,
            fingerprint: pm.acss_debit.fingerprint ?? null,
        };
    }

    // Fallback: return minimal shape for any other types
    return base;
}

async function listByType(customerId, type) {
    // Optional pagination support; you can keep it simple if you never exceed 100.
    let starting_after = undefined;
    const all = [];

    while (true) {
        const res = await stripe.paymentMethods.list({
            customer: customerId,
            type,
            limit: 100,
            ...(starting_after ? { starting_after } : {}),
        });

        all.push(...res.data);

        if (!res.has_more || res.data.length === 0) break;
        starting_after = res.data[res.data.length - 1].id;
    }

    return all;
}

export async function GET(req, { params }) {
    try {
        const { customerId } = await params; // params is not async

        if (!customerId) {
            return NextResponse.json(
                { error: "customerId is required" },
                { status: 400 }
            );
        }

        const { searchParams } = new URL(req.url);
        const typeParam = searchParams.get("type"); // if missing -> fetch all types
        const type = typeParam?.trim() || null;

        let paymentMethodsRaw = [];

        if (type) {
            // Explicit type requested
            paymentMethodsRaw = await listByType(customerId, type);
        } else {
            // No type requested: aggregate across supported types
            const results = await Promise.all(
                SUPPORTED_PM_TYPES.map(async (t) => {
                    try {
                        return await listByType(customerId, t);
                    } catch {
                        // Some types may not be enabled for your account; ignore and continue.
                        return [];
                    }
                })
            );

            paymentMethodsRaw = results.flat();
        }

        // De-duplicate by id
        const uniq = new Map();
        for (const pm of paymentMethodsRaw) uniq.set(pm.id, pm);

        const paymentMethods = Array.from(uniq.values()).map(compactPM);

        return NextResponse.json(
            {
                paymentMethods,
                fetchedType: type ?? "all",
            },
            { status: 200 }
        );
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
