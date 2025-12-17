import Link from "next/link";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";

function formatMoney(amountInMinor, currency = "usd") {
    // Stripe amounts are in the smallest currency unit (e.g., cents)
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.toUpperCase(),
    }).format((amountInMinor || 0) / 100);
}

function formatDateFromUnix(unixSeconds) {
    if (!unixSeconds) return "—";
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(unixSeconds * 1000));
}

export default async function Success({ searchParams }) {
    const { session_id } = await searchParams;

    if (!session_id) {
        throw new Error("Please provide a valid session_id (`cs_test_...`).");
    }

    const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["line_items.data.price.product", "payment_intent"],
    });

    if (session.status === "open") {
        return redirect("/dashboard");
    }

    if (session.status !== "complete") {
        return redirect("/dashboard");
    }

    const customerEmail = session.customer_details?.email ?? "—";

    const currency = session.currency ?? "usd";
    const totalPaid = formatMoney(session.amount_total, currency);
    const purchasedAt = formatDateFromUnix(session.created);

    const items = session.line_items?.data ?? [];
    const productNames = items
        .map((li) => {
            const product = li.price?.product;
            // product can be a string ID or expanded object
            if (product && typeof product === "object" && "name" in product)
                return product.name;
            return li.description || "Item";
        })
        .filter(Boolean);

    const primaryProduct = productNames[0] ?? "Your purchase";

    return (
        <main className="min-h-[70vh] bg-neutral-50 px-4 py-10">
            <div className="mx-auto w-full max-w-2xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
                        Payment successful
                    </h1>
                    <p className="mt-1 text-sm text-neutral-600">
                        Thank you for your purchase. Your order details are
                        below.
                    </p>
                </div>

                <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm text-neutral-500">Product</p>
                            <p className="mt-1 text-lg font-medium text-neutral-900">
                                {primaryProduct}
                            </p>
                            {productNames.length > 1 && (
                                <p className="mt-1 text-sm text-neutral-600">
                                    + {productNames.length - 1} more item(s)
                                </p>
                            )}
                        </div>

                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                            Paid
                        </span>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-xl bg-neutral-50 p-4">
                            <p className="text-xs text-neutral-500">
                                Total paid
                            </p>
                            <p className="mt-1 text-base font-semibold text-neutral-900">
                                {totalPaid}
                            </p>
                        </div>

                        <div className="rounded-xl bg-neutral-50 p-4">
                            <p className="text-xs text-neutral-500">
                                Purchase date
                            </p>
                            <p className="mt-1 text-sm font-medium text-neutral-900">
                                {purchasedAt}
                            </p>
                        </div>

                        <div className="rounded-xl bg-neutral-50 p-4">
                            <p className="text-xs text-neutral-500">Email</p>
                            <p className="mt-1 text-sm font-medium text-neutral-900 break-all">
                                {customerEmail}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-4">
                        <p className="text-sm text-neutral-700">
                            A confirmation email will be sent to{" "}
                            <span className="font-medium text-neutral-900">
                                {customerEmail}
                            </span>
                            . If you don’t see it, check your spam folder.
                        </p>
                        <p className="mt-2 text-sm text-neutral-700">
                            Need help? Contact{" "}
                            <a
                                className="font-medium text-neutral-900 underline"
                                href="mailto:orders@example.com"
                            >
                                bookings@eygar.com
                            </a>
                            .
                        </p>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
                        >
                            Back to dashboard
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
                        >
                            Continue shopping
                        </Link>
                    </div>
                </section>

                <p className="mt-4 text-xs text-neutral-500">
                    Reference: {session_id}
                </p>
            </div>
        </main>
    );
}
