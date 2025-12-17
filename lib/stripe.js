// import "server-only";

import Stripe from "stripe";

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export async function getCustomerTransactions(customerId) {
    if (!customerId?.startsWith("cus_")) {
        throw new Error("Invalid Stripe customer ID");
    }

    const paymentIntents = await stripe.paymentIntents.list({
        customer: customerId,
        limit: 20, // max 100
        expand: ["data.payment_method", "data.latest_charge"],
    });

    return paymentIntents.data;
}

export async function createCustomer(data) {
    const customer = await stripe.customers.create({
        name: data.name,
        email: data.email,
    });

    return customer;
}

export async function getCustomer(email) {
    const customers = await stripe.customers.list({
        email,
        limit: 1,
    });

    return customers[0];
}
