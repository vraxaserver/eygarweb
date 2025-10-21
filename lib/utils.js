import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const getStatusColor = (status) => {
    switch (status) {
        case "active":
            return "bg-green-100 text-green-800";
        case "draft":
            return "bg-yellow-100 text-yellow-800";
        case "confirmed":
            return "bg-blue-100 text-blue-800";
        case "pending":
            return "bg-orange-100 text-orange-800";
        case "checked-in":
            return "bg-green-100 text-green-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

