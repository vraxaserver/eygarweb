"use client";

import { Button } from "@/components/ui/button";
import { stripe, getCustomerTransactions, createCustomer } from "@/lib/stripe";
import { useState } from "react";

export default async function PaymentDetailsPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleCreateCustomer = async () => {
        try {
            setLoading(true);

            const res = await createCustomer({
                name: "Rashid",
                email: "charlicoder@gmail.com",
            });

            const data = await res.json();
            if (!res.ok)
                throw new Error(data?.error || "Failed to create customer");

            setResult(data);
        } catch (err) {
            console.error(err);
            setResult({ error: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Transaction History</h1>
            <div className="mt-4">
                <Button onClick={handleCreateCustomer} disabled={loading}>
                    {loading ? "Creating..." : "Create customer"}
                </Button>

                {result && (
                    <pre className="mt-4 rounded-lg bg-neutral-100 p-3 text-sm">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
}
