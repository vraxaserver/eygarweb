import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatCurrency = (
    amount: number | null | undefined, // Renamed from amountInCents to amount
    currencyCode: string | null | undefined
): string => {
    // Provide a default if data is missing
    if (typeof amount !== "number" || !currencyCode) {
        return "N/A";
    }

    // Use the browser's Internationalization API for perfect formatting
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 0, // Hides .00 for whole numbers (e.g., $100)
        maximumFractionDigits: 2, // Shows decimals if they exist (e.g., $100.50)
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