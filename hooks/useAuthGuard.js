import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/store/features/auth/authSlice";

export const useAuthGuard = (options = {}) => {
    const {
        redirectTo = "/login",
        requireAuth = true,
        redirectOnAuth = null, // Redirect authenticated users (useful for login/signup pages)
    } = options;

    const router = useRouter();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
        // Redirect unauthenticated users who need to be authenticated
        if (requireAuth && !isAuthenticated) {
            const returnUrl = router.asPath;
            router.push(
                `${redirectTo}?returnUrl=${encodeURIComponent(returnUrl)}`
            );
            return;
        }

        // Redirect authenticated users away from auth pages
        if (redirectOnAuth && isAuthenticated) {
            const returnUrl = router.query.returnUrl || redirectOnAuth;
            router.push(
                typeof returnUrl === "string" ? returnUrl : redirectOnAuth
            );
            return;
        }
    }, [isAuthenticated, requireAuth, redirectTo, redirectOnAuth, router]);

    return {
        isAuthenticated,
        canAccess: requireAuth ? isAuthenticated : true,
    };
};

// Hook for handling reservation/checkout authentication
export const useReservationAuth = () => {
    const router = useRouter();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const handleReservation = (propertyId) => {
        if (!isAuthenticated) {
            // Store the property ID and current page for after login
            const returnUrl = `/property/${propertyId}`;
            router.push(
                `/login?returnUrl=${encodeURIComponent(
                    returnUrl
                )}&action=reserve`
            );
            return false;
        }
        return true;
    };

    return { handleReservation, isAuthenticated };
};
