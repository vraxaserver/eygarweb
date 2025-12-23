import React from "react";
import {
    useGetPaymentHistoryQuery,
    useCreatePaymentMutation,
} from "../services/paymentApi";

const PaymentHistory = () => {
    // 1. Fetch Data (Auto-runs on mount)
    const { data: payments, error, isLoading } = useGetPaymentHistoryQuery();

    // 2. Setup Mutation (Manual trigger)
    const [createPayment, { isLoading: isCreating }] =
        useCreatePaymentMutation();

    const handlePayNow = async () => {
        try {
            // Payload matches your FastAPI Pydantic schema
            const paymentData = {
                booking_id: 101,
                property_id: 55,
                amount_total: 150.0,
                currency: "USD",
                description: "Vacation Rental - Dec 2025",
            };

            // unwrap() allows us to catch errors in the try/catch block
            const response = await createPayment(paymentData).unwrap();

            console.log("Payment initialized:", response);
            alert(`Payment created! ID: ${response.id}`);

            // Navigate to Stripe checkout or next step here...
        } catch (err) {
            console.error("Failed to create payment:", err);
            alert("Error creating payment session.");
        }
    };

    if (isLoading)
        return <div className="p-4">Loading transaction history...</div>;
    if (error)
        return <div className="p-4 text-red-500">Error loading data.</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Billing History</h2>
                <button
                    onClick={handlePayNow}
                    disabled={isCreating}
                    className={`px-4 py-2 rounded text-white font-medium ${
                        isCreating
                            ? "bg-gray-400"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {isCreating ? "Processing..." : "Make New Payment"}
                </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                {payments && payments.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {payments.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(
                                            payment.created_at
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        Booking #{payment.booking_id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                          payment.payment_status === "completed"
                              ? "bg-green-100 text-green-800"
                              : payment.payment_status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                      }`}
                                        >
                                            {payment.payment_status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                        ${payment.amount_total}{" "}
                                        {payment.currency?.toUpperCase()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-6 text-center text-gray-500">
                        No payment history found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentHistory;
