"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { ShieldCheck, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { useVerifyRegistrationMutation } from "@/store/features/authApi";
import { setPendingVerification } from "@/store/slices/authSlice";

const OTP_LENGTH = 6;

export default function ActivatePage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();

    const user_id = searchParams?.get("user_id");
    const identifier_type = searchParams?.get("identifier_type") || "phone";
    const email_or_phone = searchParams?.get("email_or_phone") || "";

    const [verifyRegistration, { isLoading }] = useVerifyRegistrationMutation();

    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
    const [apiError, setApiError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const inputRefs = useRef([]);

    // Focus first OTP box on mount
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    // Guard: no user_id means we shouldn't be here
    useEffect(() => {
        if (!user_id) {
            router.replace("/signup");
        }
    }, [user_id, router]);

    const handleOtpChange = (index, value) => {
        // Only allow digits
        const digit = value.replace(/\D/g, "").slice(-1);
        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);
        setApiError("");

        // Auto-advance to next input
        if (digit && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0) {
                // Move to previous input on backspace when current is empty
                const newOtp = [...otp];
                newOtp[index - 1] = "";
                setOtp(newOtp);
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!pasted) return;
        const newOtp = Array(OTP_LENGTH).fill("");
        pasted.split("").forEach((digit, i) => {
            newOtp[i] = digit;
        });
        setOtp(newOtp);
        // Focus last filled box or the box after
        const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
        inputRefs.current[focusIndex]?.focus();
    };

    const handleVerify = async () => {
        const code = otp.join("");
        if (code.length < OTP_LENGTH) {
            setApiError(`Please enter the ${OTP_LENGTH}-digit verification code.`);
            return;
        }

        setApiError("");

        try {
            await verifyRegistration({ email_or_phone, code }).unwrap();
            setIsSuccess(true);
            // Clear pending verification state and redirect to login
            dispatch(setPendingVerification(null));
            setTimeout(() => router.replace("/login"), 2000);
        } catch (error) {
            console.error("Verification error:", error);
            const errData = error?.data;
            const message =
                errData?.detail ||
                errData?.code?.[0] ||
                errData?.message ||
                errData?.non_field_errors?.[0] ||
                "Invalid or expired verification code. Please try again.";
            setApiError(message);
        }
    };

    const channelLabel = identifier_type === "email" ? "email" : "phone";

    // ── Success screen ───────────────────────────────────────────────────────
    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Verified!</h1>
                    <p className="text-gray-600 mb-2">Your account has been successfully verified.</p>
                    <p className="text-gray-500 text-sm">Redirecting you to login…</p>
                </div>
            </div>
        );
    }

    // ── Main OTP screen ──────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Account</h1>
                    <p className="text-gray-600">
                        We sent a {OTP_LENGTH}-digit code to your {channelLabel}.
                        <br />
                        Enter it below to complete registration.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {/* Error Alert */}
                    {apiError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-red-700 text-sm">{apiError}</p>
                        </div>
                    )}

                    {/* OTP Inputs */}
                    <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    digit
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-gray-300 hover:border-gray-400"
                                } ${apiError ? "border-red-300" : ""}`}
                            />
                        ))}
                    </div>

                    {/* Verify Button */}
                    <button
                        type="button"
                        onClick={handleVerify}
                        disabled={isLoading || otp.join("").length < OTP_LENGTH}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                Verifying…
                            </>
                        ) : (
                            "Verify & Complete Registration"
                        )}
                    </button>

                    {/* Back to signup */}
                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={() => {
                                dispatch(setPendingVerification(null));
                                router.replace("/signup");
                            }}
                            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mx-auto"
                        >
                            <RefreshCw className="w-3 h-3" />
                            Use a different account
                        </button>
                    </div>
                </div>

                {/* Footer note */}
                <p className="text-center text-xs text-gray-500 mt-6">
                    Didn&apos;t receive a code? Check your {channelLabel} or go back and try again.
                </p>
            </div>
        </div>
    );
}
