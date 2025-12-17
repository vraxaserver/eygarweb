import React from "react";
import { stripe, createCustomer } from "@/lib/stripe";
import { Button } from "@/components/ui/button";

const PaymentList = () => {
    const getPaymentList = async () => {
        // const payments = await stripe.payments.retrieve();
        const pid = "pi_3SeZ8HLF4B1oYS590NxI6kEo";

        const session = await stripe.checkout.sessions.retrieve(pid);
        return session;
    };

    const payments = getPaymentList();

    return <div>{JSON.stringify(payments)}</div>;
};

export default PaymentList;
