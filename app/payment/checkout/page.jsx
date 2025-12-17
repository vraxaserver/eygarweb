import CheckoutClient from "./CheckoutClient";

export default function CheckoutPage() {
    const data = {
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "qar",
                    product_data: { name: "T-shirt" },
                    unit_amount: 24344,
                },
                quantity: 1,
            },
        ],
    };

    return (
        <main>
            <h1>Checkout</h1>

            <CheckoutClient checkoutData={data} />
        </main>
    );
}
