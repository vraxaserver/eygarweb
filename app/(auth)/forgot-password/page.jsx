"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Phone, KeyRound, ArrowLeft, AlertCircle } from "lucide-react";
import { useForgotPasswordMutation } from "@/store/features/authApi";
import PhoneInputWithCountry from "@/components/ui/PhoneInputWithCountry";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("email"); // "email" | "phone"
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [countryCode, setCountryCode] = useState("+974");
    const [validationError, setValidationError] = useState("");
    const [apiError, setApiError] = useState("");

    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const validate = () => {
        setValidationError("");
        setApiError("");

        if (activeTab === "email") {
            if (!email.trim()) {
                setValidationError("Email address is required.");
                return false;
            }
            if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
                setValidationError("Please enter a valid email address.");
                return false;
            }
        } else {
            if (!phoneNumber.trim()) {
                setValidationError("Phone number is required.");
                return false;
            }
            const digits = phoneNumber.replace(/\D/g, "");
            if (digits.length < 7 || digits.length > 15) {
                setValidationError("Please enter a valid phone number (7 to 15 digits).");
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const email_or_phone =
            activeTab === "email"
                ? email.trim()
                : `${countryCode}${phoneNumber.trim()}`;

        try {
            await forgotPassword(email_or_phone).unwrap();
            // Redirect to the Reset Password page passing identifier and active tab
            router.push(
                `/reset-password?email_or_phone=${encodeURIComponent(email_or_phone)}`
            );
        } catch (error) {
            console.error("Forgot password failed:", error);
            if (error?.data?.detail) {
                setApiError(error.data.detail);
            } else if (error?.data?.message) {
                setApiError(error.data.message);
            } else if (error?.data?.email_or_phone?.[0]) {
                setApiError(error.data.email_or_phone[0]);
            } else {
                setApiError(
                    "Unable to send reset code. Please verify your details and try again."
                );
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back Link */}
                <div className="mb-6">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Sign In
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <KeyRound className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Forgot Password?
                    </h1>
                    <p className="text-gray-600">
                        No worries! Enter your registered email or phone number to receive a 6-digit reset code (valid for 15 mins).
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {/* Method Tabs */}
                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            type="button"
                            onClick={() => {
                                setActiveTab("email");
                                setValidationError("");
                                setApiError("");
                            }}
                            className={`flex-1 py-2.5 text-center font-medium text-sm border-b-2 transition-colors ${
                                activeTab === "email"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Email
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setActiveTab("phone");
                                setValidationError("");
                                setApiError("");
                            }}
                            className={`flex-1 py-2.5 text-center font-medium text-sm border-b-2 transition-colors ${
                                activeTab === "phone"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            GCC Phone
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        {/* Error Alert */}
                        {(validationError || apiError) && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-red-700 text-sm">
                                    {validationError || apiError}
                                </p>
                            </div>
                        )}

                        {activeTab === "email" ? (
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Email Address *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (validationError) setValidationError("");
                                            if (apiError) setApiError("");
                                        }}
                                        autoComplete="email"
                                        placeholder="Enter your registered email address"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    GCC Phone Number *
                                </label>
                                <PhoneInputWithCountry
                                    countryCode={countryCode}
                                    onCountryCodeChange={setCountryCode}
                                    value={phoneNumber}
                                    onChange={(e) => {
                                        setPhoneNumber(e.target.value);
                                        if (validationError) setValidationError("");
                                        if (apiError) setApiError("");
                                    }}
                                    placeholder="Enter Mobile Number (e.g. 55123456)"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                    Sending Code…
                                </>
                            ) : (
                                "Send Reset Code"
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Links */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        Remembered your password?{" "}
                        <Link
                            href="/login"
                            className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                        >
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
