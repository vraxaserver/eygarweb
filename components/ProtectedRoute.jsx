import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import {
    selectIsAuthenticated,
    selectAuthLoading,
} from "@/store/features/auth/authSlice";

const ProtectedRoute = ({
    children,
    redirectTo = "/login",
    requireAuth = true,
    showLoading = true,
}) => {
    const router = useRouter();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isLoading = useSelector(selectAuthLoading);

    useEffect(() => {
        if (requireAuth && !isLoading && !isAuthenticated) {
            // Store the intended destination
            const returnUrl = router.asPath;
            router.push(
                `${redirectTo}?returnUrl=${encodeURIComponent(returnUrl)}`
            );
        }
    }, [isAuthenticated, isLoading, requireAuth, router, redirectTo]);

    // Show loading spinner while checking authentication
    if (isLoading && showLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // If authentication is required but user is not authenticated, don't render children
    if (requireAuth && !isAuthenticated) {
        return null;
    }

    return children;
};

export default ProtectedRoute;
