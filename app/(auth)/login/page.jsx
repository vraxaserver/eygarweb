"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { LogIn } from "lucide-react"; // Imported LogIn icon to match style
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

    // Loading state with the new design background
    if (isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <LogIn className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {/* Existing Form Component */}
                    <LoginForm />

                    {/* Link to Signup */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{" "}
                            <Link
                                href="/signup"
                                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                            >
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-xs text-gray-500">
                        By signing in, you agree to our{" "}
                        <Link
                            href="/terms"
                            className="text-blue-600 hover:underline"
                        >
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                            href="/privacy"
                            className="text-blue-600 hover:underline"
                        >
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
