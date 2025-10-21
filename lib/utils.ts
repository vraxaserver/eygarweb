import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatCurrency = (
    amountInCents: number | null | undefined,
    currencyCode: string | null | undefined
): string => {
    // Provide a default if data is missing
    if (typeof amountInCents !== "number" || !currencyCode) {
        return "N/A";
    }

    // Convert from cents to the main unit (e.g., 15000 -> 150.00)
    const amount: number = amountInCents / 100;

    // Use the browser's Internationalization API for perfect formatting
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 0, // Hides .00 for whole numbers
        maximumFractionDigits: 2,
    }).format(amount);
};

export type PropertyStatus =
    | "active"
    | "draft"
    | "confirmed"
    | "pending"
    | "checked-in";

export const getStatusColor = (status: PropertyStatus): string => {
    switch (status) {
        case "active":
        case "checked-in":
            return "bg-green-100 text-green-800";
        case "draft":
            return "bg-yellow-100 text-yellow-800";
        case "confirmed":
            return "bg-blue-100 text-blue-800";
        case "pending":
            return "bg-orange-100 text-orange-800";
        // A default case is not strictly necessary here because the `PropertyStatus` type
        // covers all possible cases, but it can be good for exhaustiveness checking.
        default:
            // This function ensures that if a new status is added to the type
            // but not the switch, TypeScript will throw a compile-time error.
            const _exhaustiveCheck: never = status;
            return "bg-gray-100 text-gray-800";
    }
};