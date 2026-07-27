"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { useLoginMutation } from "@/store/features/authApi";
import { selectAuthError, clearError } from "@/store/slices/authSlice";
import PhoneInputWithCountry from "@/components/ui/PhoneInputWithCountry";

const LoginForm = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();

    const [activeTab, setActiveTab] = useState("email"); // "email" | "phone"
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [countryCode, setCountryCode] = useState("+974");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState("");

    const [login, { isLoading }] = useLoginMutation();
    const authError = useSelector(selectAuthError);

    const validateInputs = () => {
        setValidationError("");
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

        if (!password) {
            setValidationError("Password is required.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInputs()) return;

        const email_or_phone =
            activeTab === "email"
                ? email.trim()
                : `${countryCode}${phoneNumber.trim()}`;

        try {
            await login({ email_or_phone, password }).unwrap();
            const returnUrl = searchParams?.get("redirectTo") || "/dashboard";
            router.replace(returnUrl);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="space-y-5">
            {/* Login Method Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    type="button"
                    onClick={() => {
                        setActiveTab("email");
                        setValidationError("");
                        if (authError) dispatch(clearError());
                    }}
                    className={`flex-1 py-2.5 text-center font-medium text-sm border-b-2 transition-colors ${
                        activeTab === "email"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                    Email Login
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setActiveTab("phone");
                        setValidationError("");
                        if (authError) dispatch(clearError());
                    }}
                    className={`flex-1 py-2.5 text-center font-medium text-sm border-b-2 transition-colors ${
                        activeTab === "phone"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                    Phone Login
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Error Alert */}
                {(validationError || authError) && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-700 text-sm">
                            {validationError ||
                                (typeof authError === "string"
                                    ? authError
                                    : "Invalid credentials. Please try again.")}
                        </p>
                    </div>
                )}

                {/* Email Tab Content */}
                {activeTab === "email" ? (
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                                    if (authError) dispatch(clearError());
                                }}
                                autoComplete="email"
                                placeholder="Enter Email Address (e.g. name@domain.com - max 100 chars)"
                                maxLength={100}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
                            />
                        </div>
                    </div>
                ) : (
                    /* Phone Tab Content with GCC Dropdown */
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            GCC Phone Number *
                        </label>
                        <PhoneInputWithCountry
                            countryCode={countryCode}
                            onCountryCodeChange={setCountryCode}
                            value={phoneNumber}
                            onChange={(e) => {
                                setPhoneNumber(e.target.value);
                                if (validationError) setValidationError("");
                                if (authError) dispatch(clearError());
                            }}
                            placeholder="Enter Mobile Number (e.g. 55123456 - max 15 digits)"
                        />
                    </div>
                )}

                {/* Password field */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (validationError) setValidationError("");
                                if (authError) dispatch(clearError());
                            }}
                            autoComplete="current-password"
                            placeholder="Enter Your Password (min 8 chars)"
                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            Signing in…
                        </>
                    ) : (
                        "Sign In"
                    )}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
