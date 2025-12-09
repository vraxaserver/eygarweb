"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    initializeAuth,
    selectIsAuthenticated,
    selectCurrentToken,
} from "@/store/slices/authSlice";
import { useGetProfileQuery } from "@/store/features/authApi";

const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const [isAuthInitialized, setIsAuthInitialized] = useState(false);

    // Selectors
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const token = useSelector(selectCurrentToken);

    // 1. Initialize Auth State from LocalStorage on mount
    useEffect(() => {
        dispatch(initializeAuth());
        setIsAuthInitialized(true);
    }, [dispatch]);

    // 2. Fetch Profile: Only if authenticated and we have a token
    const { isLoading: profileLoading } = useGetProfileQuery(undefined, {
        skip: !token, // Skip if no token (reduces 401 errors)
    });

    // 3. Loading Gate: Don't render app until we've checked LocalStorage
    if (!isAuthInitialized) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <>
            {/* Optional: Overlay spinner if fetching profile takes time on initial load */}
            {profileLoading && isAuthenticated && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-white border border-blue-200 text-blue-800 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm font-medium">
                            Syncing profile...
                        </span>
                    </div>
                </div>
            )}

            {children}
        </>
    );
};

export default AuthProvider;
