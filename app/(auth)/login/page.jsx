"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import LoginForm from "@/components/auth/LoginForm";
import { selectIsAuthenticated } from "@/store/slices/authSlice";


export default function LoginPage() {
    const router = useRouter();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const urlParams = new URLSearchParams(window.location.search);
            const returnUrl = urlParams.get("returnUrl") || "/dashboard";
            router.push(returnUrl);
        }
    }, [isAuthenticated, router]);

    if (isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="text-center text-3xl font-extrabold text-gray-900">
                    Welcome Back
                </h1>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Sign in to your account to continue
                </p>
            </div>
            <LoginForm />
        </div>
    );
}
